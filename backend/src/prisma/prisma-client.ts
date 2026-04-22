import { join } from 'path';

const prismaClient = require(join(process.cwd(), 'node_modules', '.prisma', 'client'));

export const PrismaClient = prismaClient.PrismaClient;
export const OrderStatus = prismaClient.OrderStatus;
export const OrderPaymentStatus = prismaClient.OrderPaymentStatus;
export const PaymentMethodCode = prismaClient.PaymentMethodCode;
export const PaymentTransactionStatus = prismaClient.PaymentTransactionStatus;
export const ProductStatus = prismaClient.ProductStatus;
export const ReceiptReviewStatus = prismaClient.ReceiptReviewStatus;
export const Role = prismaClient.Role;
export const TicketPriority = prismaClient.TicketPriority;
export const TicketStatus = prismaClient.TicketStatus;
export const UserStatus = prismaClient.UserStatus;
