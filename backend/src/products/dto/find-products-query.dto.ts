import { IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

import { ProductStatus } from '../../prisma/prisma-client';

const PRODUCT_SORT_VALUES = ['relevance', 'date', 'asc', 'desc'] as const;

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: (typeof ProductStatus)[keyof typeof ProductStatus];

  @IsOptional()
  @IsIn(PRODUCT_SORT_VALUES)
  sort?: (typeof PRODUCT_SORT_VALUES)[number];
}