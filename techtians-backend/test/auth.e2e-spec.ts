import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { RedisService } from '../src/database/redis.service';
import { OTP_PROVIDER } from '../src/modules/auth/providers/otp-provider.interface';
import { AppValidationPipe } from '../src/common/pipes';
import { AllExceptionsFilter } from '../src/common/filters';
import { TransformInterceptor } from '../src/common/interceptors';
import { OtpPurpose } from '@prisma/client';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testTimestamp = Date.now();
  const testEmail = `e2e_student_${testTimestamp}@example.com`;
  const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPassword = 'Password123';

  let latestSentOtp: string = '';
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  const storageMap = new Map<string, any>();
  const mockRedisClient = {
    get: jest.fn(async (key: string) => storageMap.get(key) ?? null),
    set: jest.fn(async (key: string, val: any) => {
      storageMap.set(key, val);
      return 'OK';
    }),
    del: jest.fn(async (...keys: string[]) => {
      let count = 0;
      for (const k of keys) {
        if (storageMap.delete(k)) count++;
      }
      return count;
    }),
    incr: jest.fn(async (key: string) => {
      const val = (Number(storageMap.get(key)) || 0) + 1;
      storageMap.set(key, String(val));
      return val;
    }),
    pttl: jest.fn(async () => 60000),
    pexpire: jest.fn(async () => 1),
    expire: jest.fn(async () => 1),
  };

  const mockRedisService = {
    isReady: () => true,
    getClient: () => mockRedisClient,
    get: jest.fn(async (key: string) => storageMap.get(key) ?? null),
    set: jest.fn(async (key: string, val: any) => {
      storageMap.set(key, String(val));
    }),
    del: jest.fn(async (key: string | string[]) => {
      const keys = Array.isArray(key) ? key : [key];
      let c = 0;
      for (const k of keys) if (storageMap.delete(k)) c++;
      return c;
    }),
    incr: jest.fn(async (key: string) => {
      const val = (Number(storageMap.get(key)) || 0) + 1;
      storageMap.set(key, String(val));
      return val;
    }),
    expire: jest.fn(async () => true),
    getJson: jest.fn(async (key: string) => {
      const raw = storageMap.get(key);
      return raw ? JSON.parse(raw) : null;
    }),
    setJson: jest.fn(async (key: string, val: any) => {
      storageMap.set(key, JSON.stringify(val));
    }),
    getUserPermissions: jest.fn(async () => null),
    setUserPermissions: jest.fn(async () => {}),
    invalidateUserPermissions: jest.fn(async () => {}),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .overrideProvider(OTP_PROVIDER)
      .useValue({
        sendOtp: jest.fn(async (_id: string, otp: string) => {
          latestSentOtp = otp;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new AppValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Cleanup created test records
    if (userId) {
      await prisma.refreshToken.deleteMany({ where: { userId } });
      await prisma.studentProfile.deleteMany({ where: { userId } });
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.otpRequest.deleteMany({ where: { identifier: testEmail } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await app.close();
  });

  it('1. POST /api/v1/auth/register -> should register new student', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'E2E Student',
        email: testEmail,
        phone: testPhone,
        password: testPassword,
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testEmail);
    expect(response.body.data.tokens.accessToken).toBeDefined();
    expect(response.body.data.tokens.refreshToken).toBeDefined();

    userId = response.body.data.user.id;
    accessToken = response.body.data.tokens.accessToken;
    refreshToken = response.body.data.tokens.refreshToken;
  });

  it('2. POST /api/v1/auth/otp/send -> should dispatch OTP', async () => {
    // Wait for cooldown or send for different purpose if needed
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/otp/send')
      .send({
        identifier: testEmail,
        purpose: OtpPurpose.LOGIN,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.cooldownSeconds).toBe(60);
  });

  it('3. POST /api/v1/auth/otp/verify -> should verify valid OTP', async () => {
    // Find dispatched OTP in audit trail to verify
    const auditRecord = await prisma.otpRequest.findFirst({
      where: { identifier: testEmail, purpose: OtpPurpose.LOGIN, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    expect(auditRecord).toBeDefined();

    // Verify invalid code rejects with 400
    await request(app.getHttpServer())
      .post('/api/v1/auth/otp/verify')
      .send({
        identifier: testEmail,
        otp: '000000',
        purpose: OtpPurpose.LOGIN,
      })
      .expect(400);

    // Verify valid dispatched OTP succeeds
    if (latestSentOtp) {
      const validVerifyRes = await request(app.getHttpServer())
        .post('/api/v1/auth/otp/verify')
        .send({
          identifier: testEmail,
          otp: latestSentOtp,
          purpose: OtpPurpose.LOGIN,
        })
        .expect(200);

      expect(validVerifyRes.body.success).toBe(true);
      expect(validVerifyRes.body.data.verified).toBe(true);
    }
  });

  it('4. POST /api/v1/auth/login -> should log in with credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        identifier: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe(userId);
    expect(response.body.data.tokens.accessToken).toBeDefined();

    accessToken = response.body.data.tokens.accessToken;
    refreshToken = response.body.data.tokens.refreshToken;
  });

  it('5. GET /api/v1/auth/me -> should return authenticated user profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(userId);
    expect(response.body.data.email).toBe(testEmail);
    expect(response.body.data.roles).toContain('STUDENT');
  });

  it('6. POST /api/v1/auth/refresh -> should rotate refresh token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();

    // Update tokens with newly rotated pair
    accessToken = response.body.data.accessToken;
    const previousRefreshToken = refreshToken;
    refreshToken = response.body.data.refreshToken;

    // Previous refresh token is now revoked; re-using it must be rejected!
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: previousRefreshToken })
      .expect(401);
  });

  it('7. POST /api/v1/auth/logout -> should revoke refresh token and end session', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toContain('Logged out');

    // Trying to refresh with the revoked token must fail with 401
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });
});
