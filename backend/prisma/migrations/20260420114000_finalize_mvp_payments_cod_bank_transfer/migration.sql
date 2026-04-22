/*
  Warnings:

  - Added the required column `payment_method` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('PENDING', 'PAID', 'REJECTED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_method" "PaymentMethodCode",
ADD COLUMN     "payment_status" "OrderPaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "payment_method" "PaymentMethodCode" NOT NULL;

-- CreateIndex
CREATE INDEX "orders_payment_status_idx" ON "orders"("payment_status");

-- CreateIndex
CREATE INDEX "payment_transactions_payment_method_idx" ON "payment_transactions"("payment_method");