import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'User registered email or phone number',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email or phone is required' })
  identifier!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Account password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
