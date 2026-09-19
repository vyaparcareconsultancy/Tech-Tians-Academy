import { Injectable, UnauthorizedException, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { RoleName } from '@prisma/client';
import * as crypto from 'crypto';

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiry: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Optional()
    private readonly redisService?: RedisService,
  ) {
    this.accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      this.configService.get<string>('jwt.accessSecret') ||
      'default_access_secret_12345';
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('jwt.refreshSecret') ||
      'default_refresh_secret_12345';
    this.accessExpiry =
      this.configService.get<string>('JWT_ACCESS_EXPIRY') ||
      this.configService.get<string>('jwt.accessExpiry') ||
      '15m';
    this.refreshExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRY') ||
      this.configService.get<string>('jwt.refreshExpiry') ||
      '7d';
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokens(
    user: { id: string; email: string; roles: (RoleName | string)[]; permissions?: string[] },
    userAgent?: string,
    ip?: string,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles as string[],
      permissions: user.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiry as any,
    });

    const jti = crypto.randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      jti,
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiry as any,
    });

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: userAgent || null,
        ip: ip || null,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessExpiry,
    };
  }

  async rotateRefreshToken(
    rawRefreshToken: string,
    userAgent?: string,
    ip?: string,
  ): Promise<AuthTokens> {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(rawRefreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = this.hashToken(rawRefreshToken);

    // 1. Instant check against Redis denylist
    if (this.redisService && this.redisService.isReady()) {
      const isDenylisted = await this.redisService.get(`denylist:refresh_token:${tokenHash}`);
      if (isDenylisted) {
        // Instant reuse detection! Revoke all tokens for this user
        await this.revokeUserTokens(payload.sub);
        throw new UnauthorizedException(
          'Token reuse detected. All active sessions have been revoked. Please log in again.',
        );
      }
    }

    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    // 2. DB fallback for reuse detection
    if (tokenRecord && tokenRecord.revokedAt !== null) {
      await this.revokeUserTokens(payload.sub);
      throw new UnauthorizedException(
        'Token reuse detected. All active sessions have been revoked. Please log in again.',
      );
    }

    if (!tokenRecord || tokenRecord.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke the used refresh token in DB
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Add revoked token to Redis denylist (TTL 7 days = 604800s)
    if (this.redisService && this.redisService.isReady()) {
      await this.redisService.set(`denylist:refresh_token:${tokenHash}`, 'revoked', 7 * 24 * 3600);
    }

    // Fetch fresh user data
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null, isActive: true },
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

    if (!user) {
      throw new UnauthorizedException('User account not found or inactive');
    }

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    return this.generateTokens(
      { id: user.id, email: user.email, roles, permissions },
      userAgent,
      ip,
    );
  }

  async revokeUserTokens(userId: string): Promise<void> {
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null },
      select: { tokenHash: true },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (this.redisService && this.redisService.isReady()) {
      for (const token of activeTokens) {
        await this.redisService.set(`denylist:refresh_token:${token.tokenHash}`, 'revoked', 7 * 24 * 3600);
      }
    }
  }
}
