import { Module } from '@nestjs/common';

import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, OptionalJwtAuthGuard],
})
export class CartModule {}