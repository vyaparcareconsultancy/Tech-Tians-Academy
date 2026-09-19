import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = process.env.NODE_ENV === 'production';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    // 1. Handle NestJS HttpExceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        errorCode = HttpStatus[statusCode] || 'HTTP_EXCEPTION';
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message;
        errorCode = resObj.error || resObj.errorCode || HttpStatus[statusCode] || 'HTTP_EXCEPTION';

        // Collect extra details or requiredPermission
        if (resObj.requiredPermission) {
          details = { requiredPermission: resObj.requiredPermission };
        } else if (Array.isArray(resObj.message)) {
          details = resObj.message;
        } else if (resObj.details) {
          details = resObj.details;
        }
      }
    }
    // 2. Map Prisma errors (e.g. P2002 unique, P2025 not found)
    else if (
      exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('P')
    ) {
      const prismaError = exception as { code: string; meta?: Record<string, any>; message: string };

      switch (prismaError.code) {
        case 'P2002': {
          statusCode = HttpStatus.CONFLICT;
          errorCode = 'UNIQUE_CONSTRAINT_VIOLATION';
          const target = prismaError.meta?.target;
          const fields = Array.isArray(target) ? target.join(', ') : target || 'field';
          message = `Unique constraint violation on ${fields}`;
          details = { target: prismaError.meta?.target };
          break;
        }
        case 'P2025': {
          statusCode = HttpStatus.NOT_FOUND;
          errorCode = 'RECORD_NOT_FOUND';
          message = (prismaError.meta?.cause as string) || 'Record not found';
          details = prismaError.meta;
          break;
        }
        default: {
          statusCode = HttpStatus.BAD_REQUEST;
          errorCode = `PRISMA_${prismaError.code}`;
          message = 'Database query failed';
          details = isProduction ? undefined : prismaError.meta;
          break;
        }
      }
    }
    // 3. Unhandled standard Errors
    else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = isProduction ? 'Internal server error' : exception.message;
      details = isProduction ? undefined : exception.stack;
    }

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${statusCode}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${statusCode} [${errorCode}]: ${Array.isArray(message) ? message.join(', ') : message}`,
      );
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errorCode,
      details: details ?? null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
