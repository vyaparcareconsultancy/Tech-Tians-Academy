import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let mockRedisService: Partial<RedisService>;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'JWT_ACCESS_SECRET':
          return 'test_access_secret_1234567890';
        case 'JWT_REFRESH_SECRET':
          return 'test_refresh_secret_1234567890';
        case 'JWT_ACCESS_EXPIRY':
          return '15m';
        case 'JWT_REFRESH_EXPIRY':
          return '7d';
        default:
          return null;
      }
    }),
  } as unknown as ConfigService;

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(() => {
    jwtService = new JwtService({});
    mockRedisService = {
      isReady: jest.fn(() => true),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    service = new TokenService(
      jwtService,
      mockPrismaService,
      mockConfigService,
      mockRedisService as RedisService,
    );
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens and persist hashed refresh token in database', async () => {
      (mockPrismaService.refreshToken.create as jest.Mock).mockResolvedValue({ id: 'token-1' });

      const user = { id: 'user-1', email: 'test@example.com', roles: ['STUDENT'] };
      const tokens = await service.generateTokens(user, 'test-agent', '127.0.0.1');

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBe('15m');

      expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          tokenHash: expect.any(String),
          userAgent: 'test-agent',
          ip: '127.0.0.1',
        }),
      });
    });
  });

  describe('rotateRefreshToken', () => {
    it('should successfully rotate an active refresh token and add old token to Redis denylist', async () => {
      const rawRefreshToken = jwtService.sign(
        { sub: 'user-1', jti: 'jti-1' },
        { secret: 'test_refresh_secret_1234567890' },
      );

      const tokenHash = service.hashToken(rawRefreshToken);

      (mockPrismaService.refreshToken.findFirst as jest.Mock).mockResolvedValue({
        id: 'token-row-1',
        userId: 'user-1',
        tokenHash,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
      });

      (mockPrismaService.refreshToken.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.refreshToken.create as jest.Mock).mockResolvedValue({ id: 'token-row-2' });

      (mockPrismaService.user.findFirst as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        isActive: true,
        deletedAt: null,
        roles: [{ role: { name: 'STUDENT', permissions: [] } }],
      });

      const newTokens = await service.rotateRefreshToken(rawRefreshToken);

      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();

      expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-row-1' },
        data: { revokedAt: expect.any(Date) },
      });

      expect(mockRedisService.set).toHaveBeenCalledWith(
        `denylist:refresh_token:${tokenHash}`,
        'revoked',
        7 * 24 * 3600,
      );
    });

    it('should reject instantly if refresh token is found in Redis denylist', async () => {
      const rawRefreshToken = jwtService.sign(
        { sub: 'user-1', jti: 'jti-1' },
        { secret: 'test_refresh_secret_1234567890' },
      );

      const tokenHash = service.hashToken(rawRefreshToken);
      (mockRedisService.get as jest.Mock).mockResolvedValue('revoked');

      await expect(service.rotateRefreshToken(rawRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockRedisService.get).toHaveBeenCalledWith(`denylist:refresh_token:${tokenHash}`);
    });

    it('should detect reuse of a revoked token and revoke the entire token family for that user', async () => {
      const rawRefreshToken = jwtService.sign(
        { sub: 'user-1', jti: 'jti-1' },
        { secret: 'test_refresh_secret_1234567890' },
      );

      const tokenHash = service.hashToken(rawRefreshToken);

      (mockPrismaService.refreshToken.findFirst as jest.Mock).mockResolvedValue({
        id: 'token-row-revoked',
        userId: 'user-1',
        tokenHash,
        revokedAt: new Date(Date.now() - 5000),
        expiresAt: new Date(Date.now() + 100000),
      });

      (mockPrismaService.refreshToken.updateMany as jest.Mock).mockResolvedValue({ count: 3 });

      await expect(service.rotateRefreshToken(rawRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should reject refresh tokens with invalid signatures', async () => {
      const invalidToken = 'invalid.jwt.token';

      await expect(service.rotateRefreshToken(invalidToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
