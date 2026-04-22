import { IsUUID } from 'class-validator';

export class CreateWishlistItemDto {
  @IsUUID()
  productId!: string;
}