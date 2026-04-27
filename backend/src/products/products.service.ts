import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import type { Prisma } from '../../node_modules/.prisma/client';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '../prisma/prisma-client';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  async findAll(query: FindProductsQueryDto = {}) {
    const searchTerm = query.q?.trim() || query.search?.trim();
    const categoryFilter = query.category?.trim();
    const whereClauses: Prisma.ProductWhereInput[] = [];

    if (query.status) {
      whereClauses.push({
        status: query.status,
      });
    }

    if (categoryFilter) {
      const categoryIds = await this.resolveCategoryIds(categoryFilter);
      const categoryConditions: Prisma.ProductWhereInput[] = [
        {
          category: {
            slug: categoryFilter,
          },
        },
      ];

      if (categoryIds.length) {
        categoryConditions.unshift({
          categoryId: {
            in: categoryIds,
          },
        });
      }

      if (UUID_PATTERN.test(categoryFilter)) {
        categoryConditions.unshift({
          categoryId: categoryFilter,
        });
      }

      whereClauses.push(
        categoryConditions.length === 1
          ? categoryConditions[0]
          : {
              OR: categoryConditions,
            },
      );
    }

    if (searchTerm) {
      whereClauses.push({
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            slug: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            shortDescription: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        ],
      });
    }

    const where = whereClauses.length ? { AND: whereClauses } : undefined;
    const hasPagination = Boolean(query.page || query.limit);

    if (!hasPagination) {
      return this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: this.buildOrderBy(query.sort),
      });
    }

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 100);

    return this.findPaginated(where, page, limit, query.sort);
  }

  private async findPaginated(
    where: Prisma.ProductWhereInput | undefined,
    page: number,
    limit: number,
    sort: FindProductsQueryDto['sort'],
  ) {
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: this.buildOrderBy(sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
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

  private async resolveCategoryIds(categoryFilter: string) {
    const rootCategory = await this.prisma.category.findFirst({
      where: UUID_PATTERN.test(categoryFilter)
        ? {
            OR: [{ id: categoryFilter }, { slug: categoryFilter }],
          }
        : {
            slug: categoryFilter,
          },
      select: {
        id: true,
      },
    });

    if (!rootCategory) {
      return [];
    }

    const categoryIds = new Set<string>([rootCategory.id]);
    let parentIds = [rootCategory.id];

    while (parentIds.length) {
      const children = await this.prisma.category.findMany({
        where: {
          parentId: {
            in: parentIds,
          },
        },
        select: {
          id: true,
        },
      });

      parentIds = children
        .map((category: { id: string }) => category.id)
        .filter((id: string) => !categoryIds.has(id));

      for (const id of parentIds) {
        categoryIds.add(id);
      }
    }

    return [...categoryIds];
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
    await this.ensureProductExists(id);

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

  async addImages(id: string, imageUrls: string[]) {
    await this.ensureProductExists(id);

    const imageCount = await this.prisma.productImage.count({
      where: {
        productId: id,
      },
    });

    await this.prisma.productImage.createMany({
      data: imageUrls.map((imageUrl, index) => ({
        productId: id,
        imageUrl,
        sortOrder: imageCount + index,
      })),
    });

    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: productInclude,
    });
  }

  async removeImage(id: string, imageId: string) {
    await this.ensureProductExists(id);

    const productImage = await this.prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    if (!productImage) {
      throw new NotFoundException('Product image not found.');
    }

    await this.prisma.productImage.delete({
      where: {
        id: productImage.id,
      },
    });

    await this.removeLocalImageFile(productImage.imageUrl);

    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: productInclude,
    });
  }

  async remove(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    await Promise.all(
      existingProduct.images.map((image: { imageUrl: string }) =>
        this.removeLocalImageFile(image.imageUrl),
      ),
    );

    return {
      message: 'Product deleted successfully.',
    };
  }

  private async ensureProductExists(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
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

  private buildOrderBy(sort?: FindProductsQueryDto['sort']): Prisma.ProductOrderByWithRelationInput {
    if (sort === 'asc') {
      return { price: 'asc' };
    }

    if (sort === 'desc') {
      return { price: 'desc' };
    }

    return { createdAt: 'desc' };
  }

  private async removeLocalImageFile(imageUrl: string) {
    if (!imageUrl.startsWith('/uploads/')) {
      return;
    }

    const segments = imageUrl.replace(/^\//, '').split('/');
    const filePath = join(process.cwd(), ...segments);

    try {
      await unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}