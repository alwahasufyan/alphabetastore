import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const SUPPORTED_PROFILE_PAYMENT_METHODS = ['COD', 'BANK_TRANSFER'] as const;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  phone?: string;

  @IsOptional()
  @IsIn(SUPPORTED_PROFILE_PAYMENT_METHODS)
  preferredPaymentMethod?: string;
}