import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerStorageRedisService } from './throttler-storage-redis.service';
import { AppThrottlerGuard } from './app-throttler.guard';
import { RedisService } from '../../database/redis.service';

describe('Throttler Redis Integration & Guard', () => {
  describe('ThrottlerStorageRedisService', () => {
    let storage: ThrottlerStorageRedisService;
    let mockClient: any;
    let mockRedisService: Partial<RedisService>;

    beforeEach(() => {
      const memory = new Map<string, any>();
      mockClient = {
        get: jest.fn(async (k: string) => memory.get(k) ?? null),
        set: jest.fn(async (k: string, v: any) => memory.set(k, v)),
        incr: jest.fn(async (k: string) => {
          const val = (memory.get(k) || 0) + 1;
          memory.set(k, val);
          return val;
        }),
        pexpire: jest.fn(async () => 1),
        pttl: jest.fn(async () => 50000),
      };

      mockRedisService = {
        isReady: jest.fn(() => true),
        getClient: jest.fn(() => mockClient),
      };

      storage = new ThrottlerStorageRedisService(mockRedisService as RedisService);
    });

    it('should increment hit counts in Redis with ttl', async () => {
      const record1 = await storage.increment('ip-1', 60000, 5, 60000, 'default');
      expect(record1.totalHits).toBe(1);
      expect(record1.isBlocked).toBe(false);

      const record2 = await storage.increment('ip-1', 60000, 5, 60000, 'default');
      expect(record2.totalHits).toBe(2);
      expect(record2.isBlocked).toBe(false);
    });

    it('should block when request limit is exceeded', async () => {
      for (let i = 0; i < 5; i++) {
        await storage.increment('ip-blocked', 60000, 5, 60000, 'default');
      }

      const blockedRecord = await storage.increment('ip-blocked', 60000, 5, 60000, 'default');
      expect(blockedRecord.isBlocked).toBe(true);
      expect(mockClient.set).toHaveBeenCalledWith(
        'throttle:block:default:ip-blocked',
        '1',
        'PX',
        60000,
      );
    });

    it('should throw an error when Redis is offline', async () => {
      (mockRedisService.isReady as jest.Mock).mockReturnValue(false);

      await expect(
        storage.increment('ip-test', 60000, 5, 60000, 'default'),
      ).rejects.toThrow('Redis is offline or not connected');
    });
  });

  describe('AppThrottlerGuard', () => {
    let guard: AppThrottlerGuard;
    let mockStorage: any;

    beforeEach(() => {
      mockStorage = {
        increment: jest.fn(),
      };

      guard = new AppThrottlerGuard(
        {
          throttlers: [{ name: 'default', ttl: 60000, limit: 100 }],
        } as any,
        mockStorage,
        new Reflector(),
      );
    });

    it('should resolve tracker for /auth/login as IP:identifier', async () => {
      const req = {
        ip: '192.168.1.1',
        url: '/api/v1/auth/login',
        route: { path: '/auth/login' },
        body: { identifier: 'student@example.com' },
      };

      const tracker = await (guard as any).getTracker(req);
      expect(tracker).toBe('192.168.1.1:student@example.com');
    });

    it('should resolve tracker for /auth/otp/send as otp:identifier', async () => {
      const req = {
        ip: '192.168.1.1',
        url: '/api/v1/auth/otp/send',
        route: { path: '/auth/otp/send' },
        body: { identifier: 'student@example.com' },
      };

      const tracker = await (guard as any).getTracker(req);
      expect(tracker).toBe('otp:student@example.com');
    });

    it('should resolve tracker for /auth/register as IP', async () => {
      const req = {
        ip: '10.0.0.5',
        url: '/api/v1/auth/register',
        route: { path: '/auth/register' },
        body: { name: 'Alice', email: 'alice@example.com' },
      };

      const tracker = await (guard as any).getTracker(req);
      expect(tracker).toBe('10.0.0.5');
    });

    it('should fail closed for auth routes when storage throws', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            url: '/api/v1/auth/login',
            ip: '127.0.0.1',
          }),
          getResponse: () => ({
            header: jest.fn(),
          }),
        }),
        getHandler: () => () => {},
        getClass: () => ({}),
      } as unknown as ExecutionContext;

      mockStorage.increment.mockRejectedValue(new Error('Redis connection lost'));

      await expect(
        (guard as any).handleRequest({
          context: mockContext,
          limit: 5,
          ttl: 60000,
          throttler: { name: 'default' },
          blockDuration: 60000,
          getTracker: async () => '127.0.0.1:user',
          generateKey: () => 'key',
        }),
      ).rejects.toThrow(HttpException);

      try {
        await (guard as any).handleRequest({
          context: mockContext,
          limit: 5,
          ttl: 60000,
          throttler: { name: 'default' },
          blockDuration: 60000,
          getTracker: async () => '127.0.0.1:user',
          generateKey: () => 'key',
        });
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    it('should fail open for non-auth routes when storage throws', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            url: '/api/v1/courses',
            ip: '127.0.0.1',
          }),
          getResponse: () => ({
            header: jest.fn(),
          }),
        }),
        getHandler: () => () => {},
        getClass: () => ({}),
      } as unknown as ExecutionContext;

      mockStorage.increment.mockRejectedValue(new Error('Redis connection lost'));

      const result = await (guard as any).handleRequest({
        context: mockContext,
        limit: 100,
        ttl: 60000,
        throttler: { name: 'default' },
        blockDuration: 60000,
        getTracker: async () => '127.0.0.1',
        generateKey: () => 'key',
      });

      expect(result).toBe(true);
    });
  });
});
