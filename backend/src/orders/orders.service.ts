import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { OrderPaymentStatus, OrderStatus, PaymentMethodCode } from '../prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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
  savedAddress: {
    select: {
      id: true,
      label: true,
    },
  },
  paymentTransactions: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
    include: {
      paymentMethod: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      receipts: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          id: true,
          fileUrl: true,
          reviewStatus: true,
          createdAt: true,
        },
      },
    },
  },
  statusHistory: {
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      changedByUser: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  },
} as const;

const cartForOrderInclude = {
  items: {
    orderBy: {
      id: 'asc',
    },
    include: {
      product: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

type CartForOrder = any;

type OrderWithRelations = any;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(identity: OrderIdentity, createOrderDto: CreateOrderDto) {
    const cart = await this.findCartWithItems(identity);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    const savedAddress = await this.resolveSavedAddress(identity.userId, createOrderDto.addressId);

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
          addressId: savedAddress?.id ?? null,
          fullName: createOrderDto.fullName,
          phone: createOrderDto.phone,
          city: createOrderDto.city,
          address: createOrderDto.address,
          notes: createOrderDto.notes?.trim() || null,
          paymentStatus: OrderPaymentStatus.PENDING,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map((item: CartForOrder['items'][number]) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING,
              note: null,
              changedByUserId: identity.userId,
            },
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
    return this.findOneForAccess({
      id,
      userId: null,
      isAdmin: true,
    });
  }

  async findMine(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: orderInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order: OrderWithRelations) => this.serializeOrder(order));
  }

  async findOneForUser(id: string, userId: string, isAdmin: boolean) {
    return this.findOneForAccess({
      id,
      userId,
      isAdmin,
    });
  }

  async updateStatus(id: string, adminUserId: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found.');
    }

    if (existingOrder.status === updateOrderStatusDto.status) {
      throw new BadRequestException('Order is already in the requested status.');
    }

    const transactionResults = await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id },
        data: {
          status: updateOrderStatusDto.status,
        },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: updateOrderStatusDto.status,
          note: updateOrderStatusDto.note?.trim() || null,
          changedByUserId: adminUserId,
        },
      }),
      this.prisma.order.findUniqueOrThrow({
        where: { id },
        include: orderInclude,
      }),
    ]);

    const updatedOrder = transactionResults[2];

    return this.serializeOrder(updatedOrder);
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

  private async findOneForAccess({
    id,
    userId,
    isAdmin,
  }: {
    id: string;
    userId: string | null;
    isAdmin: boolean;
  }) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { userId }),
      },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return this.serializeOrder(order);
  }

  private async resolveSavedAddress(userId: string | null, addressId?: string) {
    if (!addressId) {
      return null;
    }

    if (!userId) {
      throw new BadRequestException('Guests cannot use saved addresses.');
    }

    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    return address;
  }

  private serializeOrder(
    order: OrderWithRelations,
  ) {
    const latestPayment = order.paymentTransactions[0] ?? null;
    const latestReceipt = latestPayment?.receipts[0] ?? null;
    const statusHistory = order.statusHistory.length
      ? order.statusHistory
      : [
          {
            id: `${order.id}-initial`,
            orderId: order.id,
            status: order.status,
            note: null,
            changedByUserId: order.userId,
            createdAt: order.createdAt,
            changedByUser: order.user
              ? {
                  id: order.user.id,
                  name: order.user.name,
                  role: order.user.role,
                }
              : null,
          },
        ];

    return {
      id: order.id,
      userId: order.userId,
      sessionId: order.sessionId,
      addressId: order.addressId,
      fullName: order.fullName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      orderPaymentMethod: order.paymentMethod,
      paymentTransactionId: latestPayment?.id ?? null,
      paymentMethodCode:
        order.paymentMethod ?? latestPayment?.paymentMethodCode ?? latestPayment?.paymentMethod.code ?? null,
      paymentMethod:
        order.paymentMethod === PaymentMethodCode.COD
          ? 'Cash on Delivery'
          : order.paymentMethod === PaymentMethodCode.BANK_TRANSFER
            ? 'Bank Transfer'
            : latestPayment?.paymentMethod.name ?? null,
      paymentStatus: order.paymentStatus ?? latestPayment?.status ?? null,
      paymentReceipt: latestReceipt
        ? {
            id: latestReceipt.id,
            fileUrl: latestReceipt.fileUrl,
            reviewStatus: latestReceipt.reviewStatus,
            createdAt: latestReceipt.createdAt,
          }
        : null,
      createdAt: order.createdAt,
      user: order.user,
      savedAddress: order.savedAddress,
      statusHistory: statusHistory.map((entry: (typeof statusHistory)[number]) => ({
        id: entry.id,
        status: entry.status,
        note: entry.note,
        createdAt: entry.createdAt,
        changedByUser: entry.changedByUser,
      })),
      items: order.items.map((item: OrderWithRelations['items'][number]) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        product: {
          id: item.product.id,
          name: item.productName || item.product.name,
          slug: item.product.slug,
          imageUrl: item.product.images[0]?.imageUrl ?? null,
        },
      })),
    };
  }
}