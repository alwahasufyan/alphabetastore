import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { FindWishlistQueryDto } from './dto/find-wishlist-query.dto';
import { WishlistService } from './wishlist.service';

type WishlistRequest = {
  user: JwtPayload;
};

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findMyWishlist(@Req() request: WishlistRequest, @Query() query: FindWishlistQueryDto) {
    return this.wishlistService.findAll(request.user.sub, query);
  }

  @Post()
  addToWishlist(@Req() request: WishlistRequest, @Body() createWishlistItemDto: CreateWishlistItemDto) {
    return this.wishlistService.create(request.user.sub, createWishlistItemDto.productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() request: WishlistRequest, @Param('productId') productId: string) {
    return this.wishlistService.remove(request.user.sub, productId);
  }
}