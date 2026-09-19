import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import { RedisService } from '../../database/redis.service';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorage {
  private readonly logger = new Logger(ThrottlerStorageRedisService.name);

  constructor(private readonly redisService: RedisService) {}

  async increment(
    key: string,
    ttl: number, // in milliseconds
    limit: number,
    blockDuration: number, // in milliseconds
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const client = this.redisService.getClient();
    if (!client || !this.redisService.isReady()) {
      throw new Error('Redis is offline or not connected');
    }

    const redisKey = `throttle:${throttlerName}:${key}`;
    const blockKey = `throttle:block:${throttlerName}:${key}`;

    // 1. Check if key is currently blocked
    const isBlocked = await client.get(blockKey);
    if (isBlocked) {
      const pttl = await client.pttl(blockKey);
      return {
        totalHits: limit + 1,
        timeToExpire: Math.max(0, Math.ceil(pttl / 1000)),
        isBlocked: true,
        timeToBlockExpire: Math.max(0, Math.ceil(pttl / 1000)),
      };
    }

    // 2. Increment request hit count
    const totalHits = await client.incr(redisKey);
    if (totalHits === 1) {
      await client.pexpire(redisKey, ttl);
    }

    const pttl = await client.pttl(redisKey);
    const timeToExpire = Math.max(0, Math.ceil(pttl / 1000));

    // 3. Block if limit exceeded
    if (totalHits > limit) {
      const blockTime = blockDuration > 0 ? blockDuration : ttl;
      await client.set(blockKey, '1', 'PX', blockTime);
      return {
        totalHits,
        timeToExpire,
        isBlocked: true,
        timeToBlockExpire: Math.ceil(blockTime / 1000),
      };
    }

    return {
      totalHits,
      timeToExpire,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
