import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const requestId =
      (request.headers['x-request-id'] as string) || crypto.randomUUID();

    // Attach request id to request headers and response header
    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);

    const { method, originalUrl, url } = request;
    const path = originalUrl || url;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const status = response.statusCode;
          this.logger.log(
            `[${requestId}] ${method} ${path} ${status} - ${duration}ms`,
          );
        },
        error: (err: any) => {
          const duration = Date.now() - start;
          const status = err.status || err.statusCode || 500;
          this.logger.error(
            `[${requestId}] ${method} ${path} ${status} - ${duration}ms - ${err.message}`,
          );
        },
      }),
    );
  }
}
