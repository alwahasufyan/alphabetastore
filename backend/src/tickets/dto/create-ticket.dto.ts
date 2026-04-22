import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const TICKET_PRIORITIES = ['NORMAL', 'URGENT'] as const;

export class CreateTicketDto {
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  subject!: string;

  @IsString()
  @MinLength(5)
  message!: string;

  @IsOptional()
  @IsString()
  @IsIn(TICKET_PRIORITIES)
  priority?: (typeof TICKET_PRIORITIES)[number];
}