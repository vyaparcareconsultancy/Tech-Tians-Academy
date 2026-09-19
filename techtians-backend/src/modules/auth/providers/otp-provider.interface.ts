import { OtpPurpose } from '@prisma/client';

export const OTP_PROVIDER = 'OTP_PROVIDER';

export interface IOtpProvider {
  sendOtp(identifier: string, otp: string, purpose: OtpPurpose): Promise<void>;
}
