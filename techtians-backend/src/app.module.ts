import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './config';
import { PrismaModule, RedisModule, RedisService } from './database';
import { CacheModule } from './common/cache';
import {
  ThrottlerStorageRedisService,
  AppThrottlerGuard,
} from './common/throttler';
import {
  HealthModule,
  AuthModule,
  UsersModule,
  CoursesModule,
} from './modules';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    RedisModule,
    CacheModule,
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000, // 1 minute
            limit: 100, // Global 100 requests/minute per IP
          },
        ],
        storage: new ThrottlerStorageRedisService(redisService),
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    CoursesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
