import { Injectable, Logger } from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';
import { IOtpProvider } from './otp-provider.interface';

@Injectable()
export class LogOtpProvider implements IOtpProvider {
  private readonly logger = new Logger(LogOtpProvider.name);

  async sendOtp(identifier: string, otp: string, purpose: OtpPurpose): Promise<void> {
    this.logger.log(
      `🔐 [OTP DISPATCH] Destination: ${identifier} | Purpose: ${purpose} | Code: [${otp}] (Expires in 5m)`,
    );
  }
}
