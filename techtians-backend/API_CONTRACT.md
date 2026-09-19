# Tech Tians - Auth API Contract

**Base URL**: `/api/v1`  
**Interactive Documentation**: `/api/docs` (Swagger UI)  
**Authentication Header**: `Authorization: Bearer <accessToken>`

---

## 1. Global API Response Envelopes

All responses from the API are wrapped in standardized JSON envelopes.

### Success Envelope
```typescript
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: Record<string, any>;
  timestamp: string; // ISO 8601
}
```

### Error Envelope
```typescript
export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string | string[];
  errorCode: string;
  details: any;
  timestamp: string; // ISO 8601
  path: string;
}
```

---

## 2. Common Data Types & Enums

```typescript
export type RoleName = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';

export type OtpPurpose = 'SIGNUP' | 'LOGIN' | 'PASSWORD_RESET' | 'PHONE_VERIFICATION';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string; // e.g. "15m"
}

export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: RoleName[];
  permissions: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}
```

---

## 3. Endpoints Specification

### 3.1 POST `/auth/register`
Creates a new student account, assigns the `STUDENT` role, creates a student profile, issues an initial JWT pair, and dispatches a verification OTP.

- **Auth**: Public
- **Rate Limit**: 5 requests / hour per IP

#### Request Body
```typescript
export interface RegisterRequest {
  name: string;      // Non-empty string
  email: string;     // Valid email address
  phone: string;     // E.164 format or 10-15 digits (e.g., "+919876543210")
  password: string;  // Min 8 chars, at least 1 letter and 1 number
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<RegisterResponse>`)
```typescript
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  tokens: AuthTokens;
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Request body missing or invalid fields (e.g. invalid email format, weak password) |
| `409 Conflict` | `UNIQUE_CONSTRAINT_VIOLATION` | Email or phone already registered |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Exceeded registration limit (5/hour per IP) |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Unexpected server or database failure |

---

### 3.2 POST `/auth/login`
Authenticates a user with email or phone and password. Returns access and refresh tokens along with the sanitized user profile.

- **Auth**: Public
- **Rate Limit**: 5 requests / minute per IP + identifier

#### Request Body
```typescript
export interface LoginRequest {
  identifier: string; // Registered email or phone
  password: string;   // Plaintext password
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<LoginResponse>`)
```typescript
export interface LoginResponse {
  user: SanitizedUser;
  tokens: AuthTokens;
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Empty identifier or password |
| `401 Unauthorized` | `UNAUTHORIZED` | Invalid credentials, account inactive, or soft-deleted |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Exceeded login rate limit (5/minute) |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Server failure |

---

### 3.3 POST `/auth/otp/send`
Dispatches a 6-digit one-time password to the target email or phone. Stores the OTP in Redis/DB with a 5-minute TTL.

- **Auth**: Public
- **Rate Limit**: 3 requests / 5 minutes per identifier

#### Request Body
```typescript
export interface SendOtpRequest {
  identifier: string;    // Email or phone number
  purpose: OtpPurpose;   // "SIGNUP" | "LOGIN" | "PASSWORD_RESET" | "PHONE_VERIFICATION"
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<SendOtpResponse>`)
```typescript
export interface SendOtpResponse {
  message: string;        // "OTP sent successfully"
  cooldownSeconds: number; // 60
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Missing identifier or invalid purpose enum |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Cooldown active (< 60s since last request) or rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Failed to deliver OTP |

---

### 3.4 POST `/auth/otp/verify`
Verifies the submitted 6-digit OTP. The OTP is single-use and invalidates after 5 failed attempts.

- **Auth**: Public
- **Rate Limit**: Standard global limit (100 req/min)

#### Request Body
```typescript
export interface VerifyOtpRequest {
  identifier: string;  // Email or phone number
  otp: string;         // 6-digit string (e.g. "123456")
  purpose: OtpPurpose; // Same purpose as when requested
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<VerifyOtpResponse>`)
```typescript
export interface VerifyOtpResponse {
  verified: boolean; // true
  message: string;  // "OTP verified successfully"
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `400 Bad Request` | `BAD_REQUEST` or `VALIDATION_ERROR` | Invalid OTP code, expired OTP, or max 5 attempts exceeded |
| `404 Not Found` | `RECORD_NOT_FOUND` | No active OTP request found for identifier and purpose |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Global rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Server failure |

---

### 3.5 POST `/auth/refresh`
Rotates the session tokens using a valid refresh token. Employs token family tracking: reusing a previously rotated or revoked token revokes the entire user session family.

- **Auth**: Public
- **Rate Limit**: Standard global limit (100 req/min)

#### Request Body
```typescript
export interface RefreshTokenRequest {
  refreshToken: string; // Valid, unrevoked refresh token JWT
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<RefreshTokenResponse>`)
```typescript
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string; // "15m"
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Missing or malformed refresh token |
| `401 Unauthorized` | `UNAUTHORIZED` | Expired token, invalid signature, revoked token, or token reuse detected |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Global rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Server failure |

---

### 3.6 POST `/auth/logout`
Revokes active refresh tokens for the user and denylists them in Redis for immediate rejection across all distributed instances.

- **Auth**: Bearer Token required (`Authorization: Bearer <accessToken>`)
- **Rate Limit**: Standard global limit (100 req/min)

#### Request Body (Optional)
```typescript
export interface LogoutRequest {
  refreshToken?: string; // Optional: specific refresh token to revoke. If omitted, all active user tokens are revoked.
}
```

#### Response Data (`data` field in `ApiSuccessEnvelope<LogoutResponse>`)
```typescript
export interface LogoutResponse {
  message: string; // "Logged out successfully"
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `401 Unauthorized` | `UNAUTHORIZED` | Missing or invalid access token |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Global rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Server failure |

---

### 3.7 GET `/auth/me`
Retrieves full user profile, assigned roles, and effective permission keys for the authenticated session.

- **Auth**: Bearer Token required (`Authorization: Bearer <accessToken>`)
- **Rate Limit**: Standard global limit (100 req/min)

#### Request
- Headers: `Authorization: Bearer <accessToken>`
- Body: None

#### Response Data (`data` field in `ApiSuccessEnvelope<UserProfileResponse>`)
```typescript
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: RoleName[];
  permissions: string[];
  studentProfile?: {
    grade?: string | null;
    targetExam?: string | null;
    city?: string | null;
    guardianName?: string | null;
    guardianPhone?: string | null;
  } | null;
  teacherProfile?: any | null;
  adminProfile?: any | null;
}
```

#### Possible Errors
| HTTP Status | `errorCode` | Description / Cause |
|---|---|---|
| `401 Unauthorized` | `UNAUTHORIZED` | Missing, expired, or invalid bearer token |
| `404 Not Found` | `RECORD_NOT_FOUND` | User account does not exist or was deleted |
| `429 Too Many Requests` | `TOO_MANY_REQUESTS` | Global rate limit exceeded |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Server failure |
