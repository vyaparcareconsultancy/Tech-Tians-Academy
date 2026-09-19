import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Nishant Singh', description: 'User full name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({ example: 'student@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'A valid email address is required' })
  email!: string;

  @ApiProperty({ example: '+919876543210', description: 'User phone number' })
  @Matches(/^(\+?[1-9]\d{1,14}|[6-9]\d{9})$/, {
    message: 'Phone number must be in valid E.164 or 10-digit Indian format',
  })
  phone!: string;

  @ApiProperty({ example: 'Password123', description: 'User password (min 8 chars, 1 letter, 1 number)' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password!: string;
}
