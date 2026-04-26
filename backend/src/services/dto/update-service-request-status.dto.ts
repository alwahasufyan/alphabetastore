import { IsIn, IsOptional, IsString } from 'class-validator';

const SERVICE_REQUEST_STATUSES = ['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'] as const;

export class UpdateServiceRequestStatusDto {
  @IsString()
  @IsIn(SERVICE_REQUEST_STATUSES)
  status!: (typeof SERVICE_REQUEST_STATUSES)[number];

  @IsOptional()
  @IsString()
  notes?: string;
}
