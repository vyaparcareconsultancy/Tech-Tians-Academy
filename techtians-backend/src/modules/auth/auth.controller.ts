import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  VerifyOtpDto,
  LogoutDto,
} from './dto';
import { Public, CurrentUser } from '../../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5/hour per IP
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register student account',
    description: 'Creates user, student profile, assigns STUDENT role, and dispatches verification OTP',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully and OTP dispatched' })
  @ApiResponse({ status: 400, description: 'Validation failed (VALIDATION_ERROR)' })
  @ApiResponse({ status: 409, description: 'Email or phone already registered (CONFLICT)' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded (TOO_MANY_REQUESTS)' })
  register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.socket.remoteAddress;
    return this.authService.register(registerDto, userAgent, ip);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5/min per IP+identifier
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates by email or phone with password. Returns access and refresh token pair.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: 'Invalid credentials (UNAUTHORIZED)' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded (TOO_MANY_REQUESTS)' })
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.socket.remoteAddress;
    return this.authService.login(loginDto, userAgent, ip);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh session tokens',
    description: 'Rotates refresh token and issues a fresh token pair. Revoked tokens trigger reuse detection.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens rotated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or reused refresh token (UNAUTHORIZED)' })
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.socket.remoteAddress;
    return this.authService.refreshTokens(dto.refreshToken, userAgent, ip);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3/5min per identifier
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dispatch 6-digit OTP',
    description: 'Generates and delivers a 6-digit OTP with 5-minute expiry and 60-second cooldown',
  })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP dispatched successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (VALIDATION_ERROR)' })
  @ApiResponse({ status: 429, description: 'Cooldown active or rate limit exceeded (TOO_MANY_REQUESTS)' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.identifier, dto.purpose);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify 6-digit OTP',
    description: 'Verifies single-use OTP. Max 5 attempts before invalidation.',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid, expired, or max attempts exceeded (BAD_REQUEST)' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.identifier, dto.otp, dto.purpose);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Log out user',
    description: 'Revokes active refresh tokens and adds them to the Redis denylist',
  })
  @ApiBody({ type: LogoutDto, required: false })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized access token (UNAUTHORIZED)' })
  logout(
    @CurrentUser('id') userId: string,
    @Body() dto?: LogoutDto,
  ) {
    return this.authService.logout(userId, dto?.refreshToken);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns authenticated user profile, roles, and effective permissions',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or missing bearer token (UNAUTHORIZED)' })
  getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
