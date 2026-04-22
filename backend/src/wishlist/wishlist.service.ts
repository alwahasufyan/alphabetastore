import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const wishlistItemSelect = {
  id: true,
  createdAt: true,
  product: {
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      },
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  },
} satisfies Prisma.WishlistItemSelect;

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      select: wishlistItemSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(userId: string, productId: string) {
    await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { id: true },
    });

    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: wishlistItemSelect,
    });

    if (existingItem) {
      return existingItem;
    }

    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      select: wishlistItemSelect,
    });
  }

  async remove(userId: string, productId: string) {
    const deleted = await this.prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    if (!deleted.count) {
      throw new NotFoundException('Wishlist item not found.');
    }

    return {
      message: 'Wishlist item removed successfully.',
    };
  }
}