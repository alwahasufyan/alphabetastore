import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

type CartRequest = {
  user?: JwtPayload | null;
};

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findCart(
    @Req() request: CartRequest,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.cartService.getCart({
      userId: request.user?.sub ?? null,
      sessionId: sessionId ?? null,
    });
  }

  @Post('items')
  addItem(
    @Req() request: CartRequest,
    @Headers('x-session-id') sessionId: string | undefined,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return this.cartService.addItem(
      {
        userId: request.user?.sub ?? null,
        sessionId: sessionId ?? null,
      },
      addCartItemDto,
    );
  }

  @Patch('items/:id')
  updateItem(
    @Req() request: CartRequest,
    @Headers('x-session-id') sessionId: string | undefined,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      {
        userId: request.user?.sub ?? null,
        sessionId: sessionId ?? null,
      },
      id,
      updateCartItemDto,
    );
  }

  @Delete('items/:id')
  removeItem(
    @Req() request: CartRequest,
    @Headers('x-session-id') sessionId: string | undefined,
    @Param('id') id: string,
  ) {
    return this.cartService.removeItem(
      {
        userId: request.user?.sub ?? null,
        sessionId: sessionId ?? null,
      },
      id,
    );
  }

  @Delete('clear')
  clear(
    @Req() request: CartRequest,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.cartService.clearCart({
      userId: request.user?.sub ?? null,
      sessionId: sessionId ?? null,
    });
  }
}