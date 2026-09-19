import * as Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test' | 'provision';
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  REDIS_URL: string;
}

export const envValidationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required().messages({
    'string.uri': 'DATABASE_URL must be a valid connection URI (e.g. postgresql://...)',
    'any.required': 'DATABASE_URL is a required environment variable',
  }),
  JWT_ACCESS_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_ACCESS_SECRET must be at least 16 characters long',
    'any.required': 'JWT_ACCESS_SECRET is a required environment variable',
  }),
  JWT_REFRESH_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_REFRESH_SECRET must be at least 16 characters long',
    'any.required': 'JWT_REFRESH_SECRET is a required environment variable',
  }),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
  REDIS_URL: Joi.string().uri().required().messages({
    'string.uri': 'REDIS_URL must be a valid connection URI (e.g. redis://...)',
    'any.required': 'REDIS_URL is a required environment variable',
  }),
});
