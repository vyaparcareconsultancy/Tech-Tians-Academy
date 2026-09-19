import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@prisma/client';

export class SendOtpDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Identifier (email address or phone number)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Identifier (email or phone) is required' })
  identifier!: string;

  @ApiProperty({
    enum: OtpPurpose,
    example: OtpPurpose.SIGNUP,
    description: 'Purpose of the OTP request',
  })
  @IsEnum(OtpPurpose, { message: 'Purpose must be a valid OtpPurpose' })
  purpose!: OtpPurpose;
}
