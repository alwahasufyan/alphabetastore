import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../prisma/prisma-client';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

const PRODUCT_UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');
const MAX_PRODUCT_IMAGE_FILES = 10;
const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

function ensureProductUploadDir() {
  if (!existsSync(PRODUCT_UPLOAD_DIR)) {
    mkdirSync(PRODUCT_UPLOAD_DIR, { recursive: true });
  }
}

const productImageStorage = diskStorage({
  destination: (_request, _file, callback) => {
    ensureProductUploadDir();
    callback(null, PRODUCT_UPLOAD_DIR);
  },
  filename: (_request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

function productImageFileFilter(
  _request: unknown,
  file: { mimetype: string; originalname: string },
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const extension = extname(file.originalname).toLowerCase();

  if (!file.mimetype.startsWith('image/') || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    callback(
      new BadRequestException(
        'Only PNG, JPG, JPEG, GIF, and WEBP image files are allowed.',
      ) as unknown as Error,
      false,
    );
    return;
  }

  callback(null, true);
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/images')
  @UseInterceptors(
    FilesInterceptor('files', MAX_PRODUCT_IMAGE_FILES, {
      storage: productImageStorage,
      fileFilter: productImageFileFilter,
      limits: {
        fileSize: MAX_PRODUCT_IMAGE_SIZE,
      },
    }),
  )
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<{ filename: string }> | undefined,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one image file is required.');
    }

    return this.productsService.addImages(
      id,
      files.map((file) => `/uploads/products/${file.filename}`),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id/images/:imageId')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}