import { Module } from '@nestjs/common';

import { CategoriesModule } from '../categories/categories.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, RolesGuard],
})
export class ProductsModule {}