import { IsIn, IsString } from 'class-validator';

const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'] as const;

export class UpdateTicketStatusDto {
  @IsString()
  @IsIn(TICKET_STATUSES)
  status!: (typeof TICKET_STATUSES)[number];
}