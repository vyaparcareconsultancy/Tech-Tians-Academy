import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...keys: string[]) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, keys);
