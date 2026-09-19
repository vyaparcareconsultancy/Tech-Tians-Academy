import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerRequest,
} from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  private readonly appLogger = new Logger(AppThrottlerGuard.name);

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const { context } = requestProps;
    const req = context.switchToHttp().getRequest();
    const isAuthRoute =
      req.url && (req.url.includes('/auth') || req.url.includes('auth/'));

    try {
      return await super.handleRequest(requestProps);
    } catch (err: any) {
      if (err instanceof ThrottlerException) {
        throw err;
      }

      // Graceful degradation: if Redis is down, log the error
      this.appLogger.error(`Rate limiter storage error: ${err.message}`);

      if (isAuthRoute) {
        // Fail closed for rate limiting on auth routes
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Too Many Requests',
            message:
              'Rate limit service unavailable. Access restricted for security.',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Fail open for non-auth routes
      return true;
    }
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip =
      req.ip ||
      req.headers?.['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    const path = req.route?.path || req.url || '';

    // /auth/login: 5/min per IP + identifier
    if (path.includes('login') && req.body?.identifier) {
      return `${ip}:${req.body.identifier}`;
    }

    // /auth/otp/send: 3/5min per identifier
    if (path.includes('otp/send') && req.body?.identifier) {
      return `otp:${req.body.identifier}`;
    }

    // Default & /auth/register: per IP
    return String(ip);
  }
}
