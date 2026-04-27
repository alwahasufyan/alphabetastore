import { Injectable } from '@nestjs/common';

import { OrderStatus, TicketStatus } from '../prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';

type MonthBucket = {
  salesUsd: number;
  orderCount: number;
};

type RecentOrderItem = {
  id: string;
  totalAmount: unknown;
  status: (typeof OrderStatus)[keyof typeof OrderStatus];
  createdAt: Date;
  fullName: string;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findSummary() {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(Date.UTC(currentYear, 0, 1));
    const nextYearStart = new Date(Date.UTC(currentYear + 1, 0, 1));

    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCategories,
      totalOrders,
      cancelledOrders,
      revenueAggregate,
      recentOrders,
      yearlyOrders,
      totalTickets,
      openTickets,
      inProgressTickets,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
      this.prisma.product.count({ where: { stockQty: { lte: 0 } } }),
      this.prisma.category.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
      this.prisma.order.aggregate({
        where: {
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          fullName: true,
        },
      }),
      this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: yearStart,
            lt: nextYearStart,
          },
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
      }),
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: TicketStatus.OPEN } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.IN_PROGRESS } }),
    ]);

    const monthlyBuckets: MonthBucket[] = Array.from({ length: 12 }, () => ({
      salesUsd: 0,
      orderCount: 0,
    }));

    for (const order of yearlyOrders) {
      const createdAt = new Date(order.createdAt);
      const monthIndex = createdAt.getUTCMonth();

      if (monthIndex < 0 || monthIndex > 11) {
        continue;
      }

      monthlyBuckets[monthIndex].orderCount += 1;
      monthlyBuckets[monthIndex].salesUsd += Number(order.totalAmount || 0);
    }

    return {
      totals: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalCategories,
        totalOrders,
        cancelledOrders,
        totalTickets,
        openTickets,
        inProgressTickets,
        totalRevenueUsd: Number(revenueAggregate._sum.totalAmount || 0),
      },
      recentOrders: recentOrders.map((order: RecentOrderItem) => ({
        id: order.id,
        customerName: order.fullName,
        status: order.status,
        createdAt: order.createdAt,
        totalAmountUsd: Number(order.totalAmount || 0),
      })),
      monthly: monthlyBuckets.map((item, index) => ({
        month: index + 1,
        salesUsd: item.salesUsd,
        orderCount: item.orderCount,
      })),
    };
  }
}
