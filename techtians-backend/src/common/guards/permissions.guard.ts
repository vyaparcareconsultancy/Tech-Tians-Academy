import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { RedisService } from '../../database/redis.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Optional() private readonly redisService?: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication token required');
    }

    // Look up live permissions in Redis first so permission changes take immediate effect
    let livePermissions: string[] | null = null;
    if (this.redisService && user.id) {
      livePermissions = await this.redisService.getUserPermissions(user.id);
    }

    // Fallback to permissions embedded in the access token JWT payload
    const effectivePermissions: string[] = livePermissions ?? user.permissions ?? [];

    // Verify all required permissions are present
    for (const requiredPermission of requiredPermissions) {
      if (!effectivePermissions.includes(requiredPermission)) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: `Forbidden resource: missing required permission '${requiredPermission}'`,
          requiredPermission,
        });
      }
    }

    return true;
  }
}
