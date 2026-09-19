import { RoleName, OtpPurpose } from '@prisma/client';

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: (RoleName | string)[];
  permissions: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

// 1. POST /auth/register
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  tokens: AuthTokensResponse;
}

// 2. POST /auth/login
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: SanitizedUser;
  tokens: AuthTokensResponse;
}

// 3. POST /auth/otp/send
export interface SendOtpRequest {
  identifier: string;
  purpose: OtpPurpose;
}

export interface SendOtpResponse {
  message: string;
  cooldownSeconds: number;
}

// 4. POST /auth/otp/verify
export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
}

// 5. POST /auth/refresh
export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = AuthTokensResponse;

// 6. POST /auth/logout
export interface LogoutRequest {
  refreshToken?: string;
}

export interface LogoutResponse {
  message: string;
}

// 7. GET /auth/me
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
  roles: (RoleName | string)[];
  permissions: string[];
  studentProfile?: any;
  teacherProfile?: any;
  adminProfile?: any;
}

// API Envelope Formats
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: any;
  timestamp: string;
}

export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string | string[];
  errorCode: string;
  details: any;
  timestamp: string;
  path: string;
}
