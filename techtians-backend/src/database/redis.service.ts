import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      this.configService.get<string>('redis.url') ||
      'redis://localhost:6379';

    try {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Do not spam reconnects if offline
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis connection error: ${err.message}`);
      });

      this.client
        .connect()
        .then(() => {
          this.logger.log('Connected to Redis');
        })
        .catch((err) => {
          this.logger.warn(`Redis offline, fallback active: ${err.message}`);
        });
    } catch (err: any) {
      this.logger.warn(`Redis initialization error: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // ignore shutdown error
      }
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  isReady(): boolean {
    return !!this.client && this.client.status === 'ready';
  }

  // Typed helpers
  async get(key: string): Promise<string | null> {
    if (!this.client || this.client.status !== 'ready') {
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (err: any) {
      this.logger.warn(`Redis GET error for "${key}": ${err.message}`);
      return null;
    }
  }

  async set(
    key: string,
    value: string | number,
    ttlSeconds?: number,
  ): Promise<void> {
    if (!this.client || this.client.status !== 'ready') {
      return;
    }
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, String(value), 'EX', ttlSeconds);
      } else {
        await this.client.set(key, String(value));
      }
    } catch (err: any) {
      this.logger.warn(`Redis SET error for "${key}": ${err.message}`);
    }
  }

  async del(key: string | string[]): Promise<number> {
    if (!this.client || this.client.status !== 'ready') {
      return 0;
    }
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length === 0) return 0;
      return await this.client.del(...keys);
    } catch (err: any) {
      this.logger.warn(`Redis DEL error: ${err.message}`);
      return 0;
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.client || this.client.status !== 'ready') {
      return 0;
    }
    try {
      return await this.client.incr(key);
    } catch (err: any) {
      this.logger.warn(`Redis INCR error for "${key}": ${err.message}`);
      return 0;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.client || this.client.status !== 'ready') {
      return false;
    }
    try {
      const res = await this.client.expire(key, ttlSeconds);
      return res === 1;
    } catch (err: any) {
      this.logger.warn(`Redis EXPIRE error for "${key}": ${err.message}`);
      return false;
    }
  }

  // Typed JSON helpers
  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (err: any) {
      this.logger.warn(`Redis JSON parse error for "${key}": ${err.message}`);
      return null;
    }
  }

  async setJson<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    try {
      const stringified = JSON.stringify(value);
      await this.set(key, stringified, ttlSeconds);
    } catch (err: any) {
      this.logger.warn(`Redis setJson error for "${key}": ${err.message}`);
    }
  }

  // Permission helpers
  async getUserPermissions(userId: string): Promise<string[] | null> {
    return this.getJson<string[]>(`user:permissions:${userId}`);
  }

  async setUserPermissions(
    userId: string,
    permissions: string[],
    ttlSeconds = 86400,
  ): Promise<void> {
    await this.setJson(`user:permissions:${userId}`, permissions, ttlSeconds);
  }

  async invalidateUserPermissions(userId: string): Promise<void> {
    await this.del(`user:permissions:${userId}`);
  }
}
