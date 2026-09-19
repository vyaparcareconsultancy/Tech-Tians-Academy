import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  HttpStatus,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { OtpPurpose } from '@prisma/client';
import { IOtpProvider, OTP_PROVIDER } from './providers/otp-provider.interface';
import * as crypto from 'crypto';

export interface RedisOtpData {
  otpHash: string;
  attempts: number;
  expiresAt: string;
  createdAt: string;
}

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(OTP_PROVIDER)
    private readonly otpProvider: IOtpProvider,
    @Optional()
    private readonly redisService?: RedisService,
  ) {}

  hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  generateNumericOtp(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }

  getRedisKey(purpose: OtpPurpose, identifier: string): string {
    return `otp:${purpose}:${identifier}`;
  }

  async sendOtp(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<{ message: string; cooldownSeconds: number }> {
    const now = new Date();
    const redisKey = this.getRedisKey(purpose, identifier);

    // 1. Check 60-second cooldown via Redis or fallback to DB
    let activeOtp: RedisOtpData | null = null;
    if (this.redisService && this.redisService.isReady()) {
      activeOtp = await this.redisService.getJson<RedisOtpData>(redisKey);
    }

    if (activeOtp) {
      const elapsed = Math.floor(
        (now.getTime() - new Date(activeOtp.createdAt).getTime()) / 1000,
      );
      if (elapsed < 60) {
        throw new HttpException(
          `Please wait ${60 - elapsed} seconds before requesting a new OTP.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } else {
      const latestOtp = await this.prisma.otpRequest.findFirst({
        where: { identifier, purpose, consumedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      if (latestOtp) {
        const elapsed = Math.floor(
          (now.getTime() - latestOtp.createdAt.getTime()) / 1000,
        );
        if (elapsed < 60) {
          throw new HttpException(
            `Please wait ${60 - elapsed} seconds before requesting a new OTP.`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }
    }

    // 2. Generate 6-digit OTP
    const rawOtp = this.generateNumericOtp(6);
    const otpHash = this.hashOtp(rawOtp);
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes TTL

    // 3. Store OTP in Redis with 5-minute (300s) TTL
    if (this.redisService && this.redisService.isReady()) {
      await this.redisService.setJson<RedisOtpData>(
        redisKey,
        {
          otpHash,
          attempts: 0,
          expiresAt: expiresAt.toISOString(),
          createdAt: now.toISOString(),
        },
        300,
      );
    }

    // 4. Record in DB as audit trail
    await this.prisma.otpRequest.create({
      data: {
        identifier,
        otpHash,
        purpose,
        expiresAt,
        attempts: 0,
      },
    });

    // 5. Deliver via pluggable provider
    await this.otpProvider.sendOtp(identifier, rawOtp, purpose);

    return {
      message: 'OTP sent successfully',
      cooldownSeconds: 60,
    };
  }

  async verifyOtp(
    identifier: string,
    rawOtp: string,
    purpose: OtpPurpose,
  ): Promise<{ verified: boolean; message: string }> {
    const now = new Date();
    const redisKey = this.getRedisKey(purpose, identifier);
    const inputHash = this.hashOtp(rawOtp);

    let redisOtp: RedisOtpData | null = null;
    if (this.redisService && this.redisService.isReady()) {
      redisOtp = await this.redisService.getJson<RedisOtpData>(redisKey);
    }

    if (redisOtp) {
      // Primary verification path via Redis
      if (redisOtp.attempts >= 5) {
        if (this.redisService) await this.redisService.del(redisKey);
        throw new BadRequestException(
          'Maximum verification attempts exceeded. Please request a new OTP.',
        );
      }

      if (new Date(redisOtp.expiresAt) < now) {
        if (this.redisService) await this.redisService.del(redisKey);
        throw new BadRequestException(
          'OTP has expired. Please request a new one.',
        );
      }

      if (redisOtp.otpHash !== inputHash) {
        redisOtp.attempts += 1;
        const remainingSeconds = Math.max(
          1,
          Math.floor((new Date(redisOtp.expiresAt).getTime() - now.getTime()) / 1000),
        );
        if (this.redisService) {
          await this.redisService.setJson(redisKey, redisOtp, remainingSeconds);
        }
        const remainingAttempts = 5 - redisOtp.attempts;
        throw new BadRequestException(
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
            : 'Invalid OTP. Maximum attempts reached.',
        );
      }

      // Valid OTP: consume from Redis immediately
      if (this.redisService) await this.redisService.del(redisKey);

      // Mark consumed in DB audit trail
      const auditRecord = await this.prisma.otpRequest.findFirst({
        where: { identifier, purpose, consumedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      if (auditRecord) {
        await this.prisma.otpRequest.update({
          where: { id: auditRecord.id },
          data: { consumedAt: now },
        });
      }
    } else {
      // Fallback verification via DB audit trail if Redis was offline or not populated
      const otpRecord = await this.prisma.otpRequest.findFirst({
        where: { identifier, purpose, consumedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        throw new BadRequestException(
          'No active OTP found. Please request a new one.',
        );
      }

      if (otpRecord.attempts >= 5) {
        throw new BadRequestException(
          'Maximum verification attempts exceeded. Please request a new OTP.',
        );
      }

      if (otpRecord.expiresAt < now) {
        throw new BadRequestException(
          'OTP has expired. Please request a new one.',
        );
      }

      if (otpRecord.otpHash !== inputHash) {
        await this.prisma.otpRequest.update({
          where: { id: otpRecord.id },
          data: { attempts: { increment: 1 } },
        });
        const remainingAttempts = 4 - otpRecord.attempts;
        throw new BadRequestException(
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
            : 'Invalid OTP. Maximum attempts reached.',
        );
      }

      await this.prisma.otpRequest.update({
        where: { id: otpRecord.id },
        data: { consumedAt: now },
      });
    }

    // Mark verified on user profile
    if (purpose === OtpPurpose.SIGNUP) {
      const isEmail = identifier.includes('@');
      if (isEmail) {
        await this.prisma.user.updateMany({
          where: { email: identifier },
          data: { isEmailVerified: true },
        });
      } else {
        await this.prisma.user.updateMany({
          where: { phone: identifier },
          data: { isPhoneVerified: true },
        });
      }
    }

    return {
      verified: true,
      message: 'OTP verified successfully',
    };
  }
}
