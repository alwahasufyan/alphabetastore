import type { Role } from '../../../node_modules/.prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};