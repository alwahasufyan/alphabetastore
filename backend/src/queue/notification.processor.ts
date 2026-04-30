import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { NOTIFICATION_JOBS, QUEUE_NAMES } from './queue.constants';

/**
 * NotificationProcessor handles background notification jobs.
 *
 * Concrete implementations (e.g. email via Nodemailer / SendGrid,
 * push notifications, SMS) should replace the logger stubs below
 * without changing how jobs are enqueued.
 */
@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case NOTIFICATION_JOBS.ORDER_PLACED:
        return this.handleOrderPlaced(job);

      case NOTIFICATION_JOBS.ORDER_STATUS_CHANGED:
        return this.handleOrderStatusChanged(job);

      case NOTIFICATION_JOBS.PAYMENT_RECEIVED:
        return this.handlePaymentReceived(job);

      case NOTIFICATION_JOBS.PAYMENT_APPROVED:
        return this.handlePaymentApproved(job);

      case NOTIFICATION_JOBS.PAYMENT_REJECTED:
        return this.handlePaymentRejected(job);

      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleOrderPlaced(job: Job): Promise<void> {
    this.logger.log(`Order placed – orderId=${job.data.orderId}`);
    // TODO: send order confirmation email
  }

  private async handleOrderStatusChanged(job: Job): Promise<void> {
    this.logger.log(
      `Order status changed – orderId=${job.data.orderId} status=${job.data.status}`,
    );
    // TODO: send order status update email
  }

  private async handlePaymentReceived(job: Job): Promise<void> {
    this.logger.log(`Payment received – paymentId=${job.data.paymentId}`);
    // TODO: send payment received notification
  }

  private async handlePaymentApproved(job: Job): Promise<void> {
    this.logger.log(`Payment approved – paymentId=${job.data.paymentId}`);
    // TODO: send payment approved email
  }

  private async handlePaymentRejected(job: Job): Promise<void> {
    this.logger.log(`Payment rejected – paymentId=${job.data.paymentId}`);
    // TODO: send payment rejected email
  }
}
