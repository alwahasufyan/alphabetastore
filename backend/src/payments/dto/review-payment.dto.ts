import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const PAYMENT_REVIEW_STATUSES = ['APPROVED', 'REJECTED'] as const;

export class ReviewPaymentDto {
  @IsString()
  @IsIn(PAYMENT_REVIEW_STATUSES)
  status!: (typeof PAYMENT_REVIEW_STATUSES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}