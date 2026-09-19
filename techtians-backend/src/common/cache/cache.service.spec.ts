import { CacheService } from './cache.service';
import { RedisService } from '../../database/redis.service';

describe('CacheService', () => {
  let cacheService: CacheService;
  let mockRedisService: Partial<RedisService>;
  let redisStore: Map<string, any>;
  let isRedisReady = true;

  beforeEach(() => {
    redisStore = new Map();
    isRedisReady = true;

    mockRedisService = {
      isReady: jest.fn(() => isRedisReady),
      getJson: jest.fn(async (key: string) => {
        if (!isRedisReady) throw new Error('Redis connection lost');
        return redisStore.get(key) ?? null;
      }),
      setJson: jest.fn(async (key: string, val: any) => {
        if (!isRedisReady) throw new Error('Redis connection lost');
        redisStore.set(key, val);
      }),
    };

    cacheService = new CacheService(mockRedisService as RedisService);
  });

  describe('buildKey', () => {
    it('should build formatted namespaced keys omitting empty segments', () => {
      const key = cacheService.buildKey('users', 'profile', 'user-123');
      expect(key).toBe('users:profile:user-123');
    });
  });

  describe('cacheOrFetch', () => {
    it('should fetch fresh data and cache it on cache miss', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ id: 1, name: 'Alice' });

      const result = await cacheService.cacheOrFetch('test:key:1', 60, fetchFn);

      expect(result).toEqual({ id: 1, name: 'Alice' });
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(mockRedisService.setJson).toHaveBeenCalledWith('test:key:1', { id: 1, name: 'Alice' }, 60);

      // Subsequent call should hit cache without invoking fetchFn again
      const cachedResult = await cacheService.cacheOrFetch('test:key:1', 60, fetchFn);
      expect(cachedResult).toEqual({ id: 1, name: 'Alice' });
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should gracefully fail open and return fresh data if Redis is offline or throws', async () => {
      isRedisReady = false;
      const fetchFn = jest.fn().mockResolvedValue({ data: 'live' });

      const result = await cacheService.cacheOrFetch('test:key:offline', 60, fetchFn);

      expect(result).toEqual({ data: 'live' });
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });
});
