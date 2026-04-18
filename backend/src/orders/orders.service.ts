import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../node_modules/.prisma/client';

import { OrderStatus } from '../prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

type OrderIdentity = {
  userId: string | null;
  sessionId: string | null;
};

const orderInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  items: {
    orderBy: {
      id: 'asc',
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
            select: {
              imageUrl: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.OrderInclude;

const cartForOrderInclude = {
  items: {
    orderBy: {
      id: 'asc',
    },
  },
} satisfies Prisma.CartInclude;

type CartForOrder = Prisma.CartGetPayload<{
  include: typeof cartForOrderInclude;
}>;

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(identity: OrderIdentity, createOrderDto: CreateOrderDto) {
    const cart = await this.findCartWithItems(identity);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    const totalAmount = cart.items.reduce(
      (sum: number, item: CartForOrder['items'][number]) =>
        sum + Number(item.unitPrice) * item.quantity,
      0,
    );

    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          userId: identity.userId,
          sessionId: identity.userId ? null : this.requireSessionId(identity),
          fullName: createOrderDto.fullName,
          phone: createOrderDto.phone,
          city: createOrderDto.city,
          address: createOrderDto.address,
          notes: createOrderDto.notes?.trim() || null,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map((item: CartForOrder['items'][number]) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: orderInclude,
      }),
      this.prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      }),
      this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return this.serializeOrder(order);
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: orderInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order: OrderWithRelations) => this.serializeOrder(order));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return this.serializeOrder(order);
  }

  private async findCartWithItems(identity: OrderIdentity) {
    return this.prisma.cart.findFirst({
      where: identity.userId
        ? {
            userId: identity.userId,
          }
        : {
            sessionId: this.requireSessionId(identity),
          },
      include: cartForOrderInclude,
    });
  }

  private requireSessionId(identity: OrderIdentity) {
    if (!identity.sessionId?.trim()) {
      throw new BadRequestException('Session id is required for guest checkout.');
    }

    return identity.sessionId;
  }

  private serializeOrder(
    order: OrderWithRelations,
  ) {
    return {
      id: order.id,
      userId: order.userId,
      sessionId: order.sessionId,
      fullName: order.fullName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt,
      user: order.user,
      items: order.items.map((item: OrderWithRelations['items'][number]) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          imageUrl: item.product.images[0]?.imageUrl ?? null,
        },
      })),
    };
  }
}