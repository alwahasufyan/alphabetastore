import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FindWishlistQueryDto } from './dto/find-wishlist-query.dto';

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

  async findAll(userId: string, query: FindWishlistQueryDto = {}) {
    const where = { userId };

    if (!this.shouldPaginate(query)) {
      return this.prisma.wishlistItem.findMany({
        where,
        select: wishlistItemSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 6);
    const [items, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where,
        select: wishlistItemSelect,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wishlistItem.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
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

  private shouldPaginate(query: FindWishlistQueryDto) {
    return Number(query.page) > 0 || Number(query.limit) > 0;
  }
}