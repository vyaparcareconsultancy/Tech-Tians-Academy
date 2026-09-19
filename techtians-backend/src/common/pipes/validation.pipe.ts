import { ValidationPipe as NestValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class AppValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      ...options,
    });
  }
}
