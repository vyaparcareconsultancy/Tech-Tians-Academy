import { ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TransformInterceptor } from './transform.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';
import { LoggingInterceptor } from './logging.interceptor';
import { createPaginatedResponse, PaginationQueryDto } from '../dto';

describe('Global API Interceptors & DTOs', () => {
  describe('TransformInterceptor', () => {
    let interceptor: TransformInterceptor<any>;
    const mockContext = {} as ExecutionContext;

    beforeEach(() => {
      interceptor = new TransformInterceptor();
    });

    it('should wrap primitive or object data in success envelope', (done) => {
      const callHandler: CallHandler = {
        handle: () => of({ name: 'Physics 101' }),
      };

      interceptor.intercept(mockContext, callHandler).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual({ name: 'Physics 101' });
        expect(response.timestamp).toBeDefined();
        done();
      });
    });

    it('should unpack data and meta when response already contains both', (done) => {
      const paginated = createPaginatedResponse(['item1', 'item2'], 2, 1, 10);
      const callHandler: CallHandler = {
        handle: () => of(paginated),
      };

      interceptor.intercept(mockContext, callHandler).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(['item1', 'item2']);
        expect(response.meta).toEqual(
          expect.objectContaining({
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
          }),
        );
        done();
      });
    });
  });

  describe('TimeoutInterceptor', () => {
    let interceptor: TimeoutInterceptor;
    const mockContext = {} as ExecutionContext;

    beforeEach(() => {
      // Use 50ms for unit testing timeout
      interceptor = new TimeoutInterceptor(50);
    });

    it('should pass through when response completes before timeout', (done) => {
      const callHandler: CallHandler = {
        handle: () => of('fast response'),
      };

      interceptor.intercept(mockContext, callHandler).subscribe((res) => {
        expect(res).toBe('fast response');
        done();
      });
    });

    it('should throw RequestTimeoutException when execution exceeds timeout limit', (done) => {
      const callHandler: CallHandler = {
        handle: () => of('delayed').pipe(delay(100)),
      };

      interceptor.intercept(mockContext, callHandler).subscribe({
        next: () => done.fail('Should have timed out'),
        error: (err) => {
          expect(err).toBeInstanceOf(RequestTimeoutException);
          done();
        },
      });
    });
  });

  describe('LoggingInterceptor', () => {
    it('should propagate correlation id x-request-id', (done) => {
      const interceptor = new LoggingInterceptor();
      const mockReq: any = {
        method: 'GET',
        url: '/test',
        headers: { 'x-request-id': 'custom-req-id-123' },
      };
      const mockRes: any = {
        setHeader: jest.fn(),
        statusCode: 200,
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockReq,
          getResponse: () => mockRes,
        }),
      } as unknown as ExecutionContext;

      const callHandler: CallHandler = {
        handle: () => of({ status: 'ok' }),
      };

      interceptor.intercept(mockContext, callHandler).subscribe(() => {
        expect(mockRes.setHeader).toHaveBeenCalledWith(
          'x-request-id',
          'custom-req-id-123',
        );
        done();
      });
    });
  });

  describe('Pagination helpers', () => {
    it('should calculate skip, take, and pagination meta accurately', () => {
      const dto = new PaginationQueryDto();
      dto.page = 3;
      dto.limit = 20;

      expect(dto.skip).toBe(40);
      expect(dto.take).toBe(20);

      const response = createPaginatedResponse(['a', 'b'], 55, 3, 20);
      expect(response.meta.totalPages).toBe(3);
      expect(response.meta.hasNextPage).toBe(false);
      expect(response.meta.hasPreviousPage).toBe(true);
    });
  });
});
