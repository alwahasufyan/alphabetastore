import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const categoryInclude = {
  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.CategoryInclude;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: categoryInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    await this.ensureParentExists(createCategoryDto.parentId);

    try {
      return await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          slug: createCategoryDto.slug,
          parentId: createCategoryDto.parentId,
          isActive: createCategoryDto.isActive ?? true,
        },
        include: categoryInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error, 'Category slug already exists.');
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found.');
    }

    if (updateCategoryDto.parentId === id) {
      throw new ConflictException('Category cannot be its own parent.');
    }

    await this.ensureParentExists(updateCategoryDto.parentId);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          slug: updateCategoryDto.slug,
          parentId: updateCategoryDto.parentId,
          isActive: updateCategoryDto.isActive,
        },
        include: categoryInclude,
      });
    } catch (error) {
      this.handleUniqueConstraint(error, 'Category slug already exists.');
      throw error;
    }
  }

  async remove(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found.');
    }

    if (existingCategory.products.length > 0) {
      throw new ConflictException('Cannot delete category with assigned products.');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully.',
    };
  }

  private async ensureParentExists(parentId?: string) {
    if (!parentId) {
      return;
    }

    const parentCategory = await this.prisma.category.findUnique({
      where: { id: parentId },
      select: {
        id: true,
      },
    });

    if (!parentCategory) {
      throw new NotFoundException('Parent category not found.');
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
}