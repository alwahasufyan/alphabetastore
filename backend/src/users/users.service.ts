import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { Role, UserStatus } from '../prisma/prisma-client';
import { CreateUserDto } from './dto/create-user.dto';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findPublicById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  createCustomer(data: CreateUserDto & { passwordHash: string }) {
    const payload: Prisma.UserCreateInput = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
    };

    return this.prisma.user.create({
      data: payload,
      select: publicUserSelect,
    });
  }
}