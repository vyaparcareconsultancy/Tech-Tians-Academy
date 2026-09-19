import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@prisma/client';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Identifier (email address or phone number)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit numeric OTP code',
  })
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp!: string;

  @ApiProperty({
    enum: OtpPurpose,
    example: OtpPurpose.SIGNUP,
    description: 'Purpose of the OTP verification',
  })
  @IsEnum(OtpPurpose, { message: 'Purpose must be a valid OtpPurpose' })
  purpose!: OtpPurpose;
}
