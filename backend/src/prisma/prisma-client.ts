import { join } from 'path';

import type * as PrismaClientModule from '../../node_modules/.prisma/client';

const prismaClient = require(join(process.cwd(), 'node_modules', '.prisma', 'client')) as typeof PrismaClientModule;

export const PrismaClient = prismaClient.PrismaClient;
export const OrderStatus = prismaClient.OrderStatus;
export const ProductStatus = prismaClient.ProductStatus;
export const Role = prismaClient.Role;
export const UserStatus = prismaClient.UserStatus;
