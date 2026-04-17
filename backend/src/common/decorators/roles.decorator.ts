import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../../node_modules/.prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);