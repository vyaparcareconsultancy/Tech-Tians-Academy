import { BadRequestException, HttpException } from '@nestjs/common';
import { OtpService, RedisOtpData } from './otp.service';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { IOtpProvider } from './providers/otp-provider.interface';
import { OtpPurpose } from '@prisma/client';

describe('OtpService', () => {
  let service: OtpService;
  let mockRedisService: Partial<RedisService>;
  let redisStore: Map<string, any>;

  const mockPrismaService = {
    otpRequest: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      updateMany: jest.fn(),
    },
  } as unknown as PrismaService;

  const mockOtpProvider: IOtpProvider = {
    sendOtp: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    redisStore = new Map();
    mockRedisService = {
      isReady: jest.fn(() => true),
      getJson: jest.fn(async (k: string) => redisStore.get(k) ?? null),
      setJson: jest.fn(async (k: string, v: any) => {
        redisStore.set(k, v);
      }),
      del: jest.fn(async (k: string | string[]) => {
        const keys = Array.isArray(k) ? k : [k];
        let count = 0;
        keys.forEach((key) => {
          if (redisStore.delete(key)) count++;
        });
        return count;
      }),
    };

    service = new OtpService(
      mockPrismaService,
      mockOtpProvider,
      mockRedisService as RedisService,
    );
    jest.clearAllMocks();
  });

  describe('generateNumericOtp', () => {
    it('should generate a 6-digit numeric string', () => {
      const otp = service.generateNumericOtp(6);
      expect(otp).toMatch(/^\d{6}$/);
    });
  });

  describe('sendOtp with Redis', () => {
    it('should create an OTP in Redis with 300s TTL and write to DB audit log', async () => {
      (mockPrismaService.otpRequest.create as jest.Mock).mockResolvedValue({ id: 'otp-1' });

      const res = await service.sendOtp('test@example.com', OtpPurpose.SIGNUP);

      expect(res.message).toBe('OTP sent successfully');
      expect(mockRedisService.setJson).toHaveBeenCalledWith(
        'otp:SIGNUP:test@example.com',
        expect.objectContaining({
          otpHash: expect.any(String),
          attempts: 0,
        }),
        300,
      );
      expect(mockPrismaService.otpRequest.create).toHaveBeenCalled();
      expect(mockOtpProvider.sendOtp).toHaveBeenCalled();
    });

    it('should reject request if sent within 60s cooldown window stored in Redis', async () => {
      redisStore.set('otp:SIGNUP:test@example.com', {
        createdAt: new Date(Date.now() - 30 * 1000).toISOString(),
      });

      await expect(
        service.sendOtp('test@example.com', OtpPurpose.SIGNUP),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('verifyOtp with Redis', () => {
    it('should verify valid OTP from Redis, consume it, and update DB audit log', async () => {
      const rawOtp = '123456';
      const otpHash = service.hashOtp(rawOtp);

      redisStore.set('otp:SIGNUP:student@example.com', {
        otpHash,
        attempts: 0,
        expiresAt: new Date(Date.now() + 100000).toISOString(),
        createdAt: new Date().toISOString(),
      });

      (mockPrismaService.otpRequest.findFirst as jest.Mock).mockResolvedValue({ id: 'otp-audit-1' });
      (mockPrismaService.otpRequest.update as jest.Mock).mockResolvedValue({});
      (mockPrismaService.user.updateMany as jest.Mock).mockResolvedValue({});

      const result = await service.verifyOtp(
        'student@example.com',
        rawOtp,
        OtpPurpose.SIGNUP,
      );

      expect(result.verified).toBe(true);
      expect(mockRedisService.del).toHaveBeenCalledWith('otp:SIGNUP:student@example.com');
      expect(mockPrismaService.otpRequest.update).toHaveBeenCalledWith({
        where: { id: 'otp-audit-1' },
        data: { consumedAt: expect.any(Date) },
      });
    });

    it('should increment attempt count in Redis and reject on incorrect OTP', async () => {
      const actualHash = service.hashOtp('654321');

      redisStore.set('otp:SIGNUP:student@example.com', {
        otpHash: actualHash,
        attempts: 1,
        expiresAt: new Date(Date.now() + 100000).toISOString(),
        createdAt: new Date().toISOString(),
      });

      await expect(
        service.verifyOtp('student@example.com', '111111', OtpPurpose.SIGNUP),
      ).rejects.toThrow(BadRequestException);

      const updated = redisStore.get('otp:SIGNUP:student@example.com') as RedisOtpData;
      expect(updated.attempts).toBe(2);
    });

    it('should reject when maximum attempts (5) are exceeded in Redis', async () => {
      redisStore.set('otp:SIGNUP:student@example.com', {
        otpHash: 'hash',
        attempts: 5,
        expiresAt: new Date(Date.now() + 100000).toISOString(),
        createdAt: new Date().toISOString(),
      });

      await expect(
        service.verifyOtp('student@example.com', '123456', OtpPurpose.SIGNUP),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
