import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '../prisma/prisma-client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
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
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: productInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    await this.ensureCategoryExists(createProductDto.categoryId);

    const slug = this.createSlug(createProductDto.slug ?? createProductDto.name);

    try {
      return await this.prisma.product.create({
        data: {
          categoryId: createProductDto.categoryId,
          name: createProductDto.name,
          slug,
          description: createProductDto.description,
          shortDescription: createProductDto.shortDescription,
          price: createProductDto.price,
          stockQty: createProductDto.stockQty,
          status: createProductDto.status ?? ProductStatus.ACTIVE,
          images: createProductDto.imageUrls?.length
            ? {
                create: createProductDto.imageUrls.map((imageUrl, index) => ({
                  imageUrl,
                  sortOrder: index,
                })),
              }
            : undefined,
        },
        include: productInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error, 'Product slug already exists.');
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found.');
    }

    if (updateProductDto.categoryId) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: updateProductDto.categoryId,
          name: updateProductDto.name,
          slug: updateProductDto.slug,
          description: updateProductDto.description,
          shortDescription: updateProductDto.shortDescription,
          price: updateProductDto.price,
          stockQty: updateProductDto.stockQty,
          status: updateProductDto.status,
          images: updateProductDto.imageUrls
            ? {
                deleteMany: {},
                create: updateProductDto.imageUrls.map((imageUrl, index) => ({
                  imageUrl,
                  sortOrder: index,
                })),
              }
            : undefined,
        },
        include: productInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error, 'Product slug already exists.');
      throw error;
    }
  }

  async remove(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully.',
    };
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }
  }

  private handleUniqueConstraint(error: unknown, message: string) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
  }

  private createSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }
}