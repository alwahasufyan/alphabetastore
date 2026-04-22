import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { TicketPriority, TicketStatus } from '../prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { AddTicketMessageDto } from './dto/add-ticket-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

const ticketUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

const ticketListInclude = {
  user: {
    select: ticketUserSelect,
  },
  messages: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
    include: {
      sender: {
        select: ticketUserSelect,
      },
    },
  },
} satisfies Prisma.TicketInclude;

const ticketDetailInclude = {
  user: {
    select: ticketUserSelect,
  },
  messages: {
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      sender: {
        select: ticketUserSelect,
      },
    },
  },
} satisfies Prisma.TicketInclude;

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const subject = createTicketDto.subject.trim();
    const message = createTicketDto.message.trim();

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber: await this.generateTicketNumber(),
        userId,
        subject,
        priority: createTicketDto.priority ?? TicketPriority.NORMAL,
        messages: {
          create: {
            senderId: userId,
            message,
          },
        },
      },
      include: ticketDetailInclude,
    });

    return this.serializeTicket(ticket);
  }

  async findMine(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        userId,
      },
      include: ticketListInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tickets.map((ticket: any) => this.serializeTicket(ticket));
  }

  async findAllAdminTickets() {
    const tickets = await this.prisma.ticket.findMany({
      include: ticketListInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tickets.map((ticket: any) => this.serializeTicket(ticket));
  }

  async findOneForUser(id: string, userId: string, isAdmin: boolean) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: ticketDetailInclude,
    });

    if (!ticket || (!isAdmin && ticket.userId !== userId)) {
      throw new NotFoundException('Ticket not found.');
    }

    return this.serializeTicket(ticket);
  }

  async addMessage(
    id: string,
    userId: string,
    isAdmin: boolean,
    addTicketMessageDto: AddTicketMessageDto,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!ticket || (!isAdmin && ticket.userId !== userId)) {
      throw new NotFoundException('Ticket not found.');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        status:
          isAdmin && ticket.status === TicketStatus.OPEN
            ? TicketStatus.IN_PROGRESS
            : undefined,
        messages: {
          create: {
            senderId: userId,
            message: addTicketMessageDto.message.trim(),
          },
        },
      },
      include: ticketDetailInclude,
    });

    return this.serializeTicket(updatedTicket);
  }

  async updateStatus(id: string, updateTicketStatusDto: UpdateTicketStatusDto) {
    const existingTicket = await this.prisma.ticket.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found.');
    }

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: {
        status: updateTicketStatusDto.status,
      },
      include: ticketDetailInclude,
    });

    return this.serializeTicket(ticket);
  }

  private async generateTicketNumber() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const randomSegment = Math.floor(1000 + Math.random() * 9000);
      const candidate = `TKT-${Date.now()}-${randomSegment}`;
      const existingTicket = await this.prisma.ticket.findUnique({
        where: {
          ticketNumber: candidate,
        },
        select: {
          id: true,
        },
      });

      if (!existingTicket) {
        return candidate;
      }
    }

    return `TKT-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  private serializeTicket(ticket: any) {
    const messages = Array.isArray(ticket.messages)
      ? [...ticket.messages]
          .sort((left, right) => {
            const leftTime = new Date(left.createdAt).getTime();
            const rightTime = new Date(right.createdAt).getTime();
            return leftTime - rightTime;
          })
          .map((message: any) => ({
            id: message.id,
            message: message.message,
            createdAt: message.createdAt,
            sender: message.sender
              ? {
                  id: message.sender.id,
                  name: message.sender.name,
                  email: message.sender.email,
                  role: message.sender.role,
                }
              : null,
          }))
      : [];

    const lastMessage = messages.at(-1) ?? null;

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      userId: ticket.userId,
      user: ticket.user
        ? {
            id: ticket.user.id,
            name: ticket.user.name,
            email: ticket.user.email,
            role: ticket.user.role,
          }
        : null,
      lastMessage,
      messages,
    };
  }
}