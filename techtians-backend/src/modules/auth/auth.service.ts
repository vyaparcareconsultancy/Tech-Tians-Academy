import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { TokenService, AuthTokens } from './token.service';
import { OtpService } from './otp.service';
import { RegisterDto, LoginDto } from './dto';
import { RoleName, OtpPurpose } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    @Optional() private readonly redisService?: RedisService,
  ) {}

  async register(
    registerDto: RegisterDto,
    userAgent?: string,
    ip?: string,
  ): Promise<{
    message: string;
    user: { id: string; name: string; email: string; phone: string | null };
    tokens: AuthTokens;
  }> {
    const { name, email, phone, password } = registerDto;

    // Validate uniqueness
    const existingEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    const existingPhone = await this.prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      throw new ConflictException('An account with this phone number already exists');
    }

    // Hash password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // Look up STUDENT role and its permissions
    const studentRole = await this.prisma.role.findUnique({
      where: { name: RoleName.STUDENT },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!studentRole) {
      throw new NotFoundException('STUDENT role not initialized in database');
    }

    const permissions = studentRole.permissions.map((rp) => rp.permission.key);

    // Execute User + StudentProfile + UserRole in a single transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          isEmailVerified: false,
          isPhoneVerified: false,
          isActive: true,
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: user.id,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: studentRole.id,
        },
      });

      return user;
    });

    // Trigger OTP send
    await this.otpService.sendOtp(email, OtpPurpose.SIGNUP);

    // Issue initial session tokens with embedded permissions
    const tokens = await this.tokenService.generateTokens(
      { id: newUser.id, email: newUser.email, roles: [RoleName.STUDENT], permissions },
      userAgent,
      ip,
    );

    // Cache permissions in Redis
    if (this.redisService) {
      await this.redisService.setUserPermissions(newUser.id, permissions);
    }

    return {
      message: 'Registration successful. An OTP has been dispatched for verification.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      tokens,
    };
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ip?: string,
  ): Promise<{
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      roles: string[];
      permissions: string[];
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
    tokens: AuthTokens;
  }> {
    const { identifier, password } = loginDto;

    // Search by email or phone with role permissions
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Never leak user existence: generic error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reject inactive or soft-deleted users
    if (!user.isActive || user.deletedAt !== null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    const tokens = await this.tokenService.generateTokens(
      { id: user.id, email: user.email, roles, permissions },
      userAgent,
      ip,
    );

    // Cache effective permissions in Redis for fast lookup and dynamic revocation
    if (this.redisService) {
      await this.redisService.setUserPermissions(user.id, permissions);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles,
        permissions,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
      tokens,
    };
  }

  async refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ): Promise<AuthTokens> {
    return this.tokenService.rotateRefreshToken(refreshToken, userAgent, ip);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null, isActive: true },
      include: {
        studentProfile: true,
        teacherProfile: true,
        adminProfile: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User session invalid or expired');
    }

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      roles,
      permissions,
      studentProfile: user.studentProfile,
      teacherProfile: user.teacherProfile,
      adminProfile: user.adminProfile,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<{ message: string }> {
    if (refreshToken) {
      const tokenHash = this.tokenService.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (this.redisService && this.redisService.isReady()) {
        await this.redisService.set(`denylist:refresh_token:${tokenHash}`, 'revoked', 7 * 24 * 3600);
      }
    } else {
      await this.tokenService.revokeUserTokens(userId);
    }
    return { message: 'Logged out successfully' };
  }
}
