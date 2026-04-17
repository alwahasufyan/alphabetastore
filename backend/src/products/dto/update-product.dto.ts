import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

import { ProductStatus } from '../../prisma/prisma-client';

export class UpdateProductDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  shortDescription?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: (typeof ProductStatus)[keyof typeof ProductStatus];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  imageUrls?: string[];
}