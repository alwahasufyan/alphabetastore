import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtPayload } from '../auth/types/jwt-payload.type';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../prisma/prisma-client';
import { AddTicketMessageDto } from './dto/add-ticket-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketsService } from './tickets.service';

type TicketsRequest = {
  user: JwtPayload;
};

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  create(@Req() request: TicketsRequest, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(request.user.sub, createTicketDto);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() request: TicketsRequest) {
    return this.ticketsService.findMine(request.user.sub);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() request: TicketsRequest, @Param('id') id: string) {
    const user = request.user;

    return this.ticketsService.findOneForUser(id, user.sub, user.role === Role.ADMIN);
  }

  @Post('tickets/:id/messages')
  @UseGuards(JwtAuthGuard)
  addMessage(
    @Req() request: TicketsRequest,
    @Param('id') id: string,
    @Body() addTicketMessageDto: AddTicketMessageDto,
  ) {
    const user = request.user;

    return this.ticketsService.addMessage(
      id,
      user.sub,
      user.role === Role.ADMIN,
      addTicketMessageDto,
    );
  }

  @Get('admin/tickets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdminTickets() {
    return this.ticketsService.findAllAdminTickets();
  }

  @Patch('admin/tickets/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketsService.updateStatus(id, updateTicketStatusDto);
  }
}