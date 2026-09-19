import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Specific refresh token to revoke. If omitted, all active sessions are revoked.',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
