import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import { AppValidationPipe } from './common/pipes';
import { AllExceptionsFilter } from './common/filters';
import {
  LoggingInterceptor,
  TransformInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const isProduction = nodeEnv === 'production';

  // 1. Security Headers (Helmet)
  app.use(helmet());

  // 2. CORS driven by env allowlist
  const rawAllowedOrigins =
    configService.get<string>('CORS_ORIGIN') ||
    configService.get<string>('ALLOWED_ORIGINS') ||
    '*';

  const allowedOrigins =
    rawAllowedOrigins === '*'
      ? '*'
      : rawAllowedOrigins.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin:
      allowedOrigins === '*'
        ? true
        : (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
          ) => {
            if (!origin || (allowedOrigins as string[]).includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
          },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 3. Graceful shutdown hooks with Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // 4. Global API Prefix "api/v1", excluding health check
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 5. Global ValidationPipe (whitelist, forbidNonWhitelisted, transform, implicit conversion)
  app.useGlobalPipes(new AppValidationPipe());

  // 6. Global Exception Filter (AllExceptionsFilter)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 7. Global Interceptors (Logging, Response Transform, 30s Timeout)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(30000),
  );

  // 8. Swagger OpenAPI Documentation at /api/docs
  const isSwaggerEnabled =
    configService.get<string>('SWAGGER_ENABLED') === 'true';

  if (!isProduction || isSwaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Tech Tians API')
      .setDescription(
        'Tech Tians modular ed-tech platform API with JWT authentication, RBAC, Redis caching, and rate limiting',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter your JWT access token',
          in: 'header',
        },
        'bearer',
      )
      .addTag('Health', 'System and service health check endpoints')
      .addTag('Auth', 'Authentication, registration, OTP, and token rotation')
      .addTag('Users', 'User account and profile management')
      .addTag('Courses', 'Course management and RBAC access control')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 Server running on: http://localhost:${port}`);
  logger.log(`❤️  Health check: http://localhost:${port}/health`);
  logger.log(`🌐 API endpoint prefix: http://localhost:${port}/api/v1`);
}

bootstrap();
