import { IsIn, IsString } from 'class-validator';

const PAYMENT_METHOD_CODES = ['COD', 'BANK_TRANSFER'] as const;

export class CreateOrderPaymentDto {
  @IsString()
  @IsIn(PAYMENT_METHOD_CODES)
  paymentMethod!: (typeof PAYMENT_METHOD_CODES)[number];
}