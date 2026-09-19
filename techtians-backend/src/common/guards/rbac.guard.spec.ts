import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { RedisService } from '../../database/redis.service';

function createMockExecutionContext(user?: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user,
      }),
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
    getHandler: () => () => {},
    getClass: () => ({}),
    getType: () => 'http',
    getArgs: () => [],
    getArgByIndex: () => ({}),
    switchToRpc: () => ({} as any),
    switchToWs: () => ({} as any),
  } as unknown as ExecutionContext;
}

describe('RBAC & PBAC Guards', () => {
  let reflector: Reflector;
  let mockRedisService: Partial<RedisService>;

  beforeEach(() => {
    reflector = new Reflector();
  });

  describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;

    beforeEach(() => {
      rolesGuard = new RolesGuard(reflector);
    });

    it('should throw UnauthorizedException when no user/token is attached to request', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.ADMIN]);
      const context = createMockExecutionContext(null);

      expect(() => rolesGuard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when user has the wrong role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.ADMIN]);
      const context = createMockExecutionContext({
        id: 'user-1',
        email: 'student@example.com',
        roles: [RoleName.STUDENT],
      });

      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);

      try {
        rolesGuard.canActivate(context);
      } catch (err: any) {
        expect(err.getStatus()).toBe(403);
        const response = err.getResponse();
        expect(response.message).toContain('ADMIN');
      }
    });

    it('should allow access on happy path when user has one of the allowed roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleName.TEACHER, RoleName.ADMIN]);
      const context = createMockExecutionContext({
        id: 'user-2',
        email: 'teacher@example.com',
        roles: [RoleName.TEACHER],
      });

      const canActivate = rolesGuard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it('should allow access if route has no @Roles decorator', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const context = createMockExecutionContext({ id: 'user-3', roles: [RoleName.STUDENT] });

      expect(rolesGuard.canActivate(context)).toBe(true);
    });
  });

  describe('PermissionsGuard', () => {
    let permissionsGuard: PermissionsGuard;
    let redisStore: Map<string, string[]>;

    beforeEach(() => {
      redisStore = new Map();
      mockRedisService = {
        getUserPermissions: jest.fn(async (userId: string) => redisStore.get(userId) ?? null),
        setUserPermissions: jest.fn(async (userId: string, permissions: string[]) => {
          redisStore.set(userId, permissions);
        }),
      };
      permissionsGuard = new PermissionsGuard(reflector, mockRedisService as RedisService);
    });

    it('should throw UnauthorizedException when no user/token is attached to request', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['course.create']);
      const context = createMockExecutionContext(null);

      await expect(permissionsGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 403 ForbiddenException with { statusCode, message, requiredPermission } when permission is missing', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['course.create']);
      const context = createMockExecutionContext({
        id: 'user-1',
        email: 'user@example.com',
        roles: [RoleName.STUDENT],
        permissions: ['course.read'],
      });

      try {
        await permissionsGuard.canActivate(context);
        fail('Expected ForbiddenException to be thrown');
      } catch (err: any) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.getStatus()).toBe(403);
        const res = err.getResponse();
        expect(res).toEqual({
          statusCode: 403,
          message: "Forbidden resource: missing required permission 'course.create'",
          requiredPermission: 'course.create',
        });
      }
    });

    it('should reject immediately when Redis live cache indicates a permission was revoked, bypassing token permissions', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['course.delete']);

      // Access token still claims user has 'course.delete'
      const user = {
        id: 'user-revoked',
        email: 'revoked@example.com',
        roles: [RoleName.ADMIN],
        permissions: ['course.read', 'course.delete'],
      };

      // But Redis live cache has revoked 'course.delete'
      redisStore.set('user-revoked', ['course.read']);

      const context = createMockExecutionContext(user);

      try {
        await permissionsGuard.canActivate(context);
        fail('Expected ForbiddenException');
      } catch (err: any) {
        expect(err).toBeInstanceOf(ForbiddenException);
        const res = err.getResponse();
        expect(res.requiredPermission).toBe('course.delete');
      }
    });

    it('should allow access on happy path when user has required permissions in token fallback', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['course.create']);
      const context = createMockExecutionContext({
        id: 'user-teacher',
        email: 'teacher@example.com',
        roles: [RoleName.TEACHER],
        permissions: ['course.create', 'course.read'],
      });

      const result = await permissionsGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should allow access on happy path when live permissions in Redis satisfy requirement', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['course.create']);

      // Token has no permissions, but live Redis cache grants 'course.create'
      redisStore.set('user-dynamic', ['course.create']);

      const context = createMockExecutionContext({
        id: 'user-dynamic',
        email: 'dyn@example.com',
        roles: [RoleName.TEACHER],
        permissions: [],
      });

      const result = await permissionsGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should allow access if route has no @RequirePermissions decorator', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const context = createMockExecutionContext({
        id: 'user-anon',
        permissions: [],
      });

      const result = await permissionsGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
});
