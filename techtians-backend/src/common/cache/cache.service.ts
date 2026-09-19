import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../database/redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redisService: RedisService) {}

  buildKey(namespace: string, ...parts: (string | number)[]): string {
    return [namespace, ...parts]
      .filter((p) => p !== undefined && p !== null && p !== '')
      .join(':');
  }

  async cacheOrFetch<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>,
  ): Promise<T> {
    try {
      if (this.redisService.isReady()) {
        const cached = await this.redisService.getJson<T>(key);
        if (cached !== null && cached !== undefined) {
          return cached;
        }
      }
    } catch (err: any) {
      // Fail open: log warning and proceed to fetch fresh data
      this.logger.warn(
        `Cache lookup error for "${key}", failing open to fetch: ${err.message}`,
      );
    }

    const freshData = await fetchFn();

    try {
      if (
        this.redisService.isReady() &&
        freshData !== null &&
        freshData !== undefined
      ) {
        await this.redisService.setJson<T>(key, freshData, ttlSeconds);
      }
    } catch (err: any) {
      this.logger.warn(`Failed to write to cache for "${key}": ${err.message}`);
    }

    return freshData;
  }
}
