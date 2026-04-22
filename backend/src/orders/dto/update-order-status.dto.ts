import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OrderStatus } from '../../prisma/prisma-client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: (typeof OrderStatus)[keyof typeof OrderStatus];

  @IsOptional()
  @IsString()
  note?: string;
}