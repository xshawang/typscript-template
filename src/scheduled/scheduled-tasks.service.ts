import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Gift } from '../entities/gift.entity';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = Logger;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Run every day at midnight
  async handleAutoRefund() {
    this.logger.log('Running auto-refund task...', 'ScheduledTasksService');

    try {
      // Find orders that have applied for refund and are older than 3 days
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const ordersToRefund = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.returnDate IS NOT NULL')
        .andWhere('order.returnSuccessFlag = 0 OR order.returnSuccessFlag IS NULL')
        .andWhere('order.returnDate < :threeDaysAgo', { threeDaysAgo })
        .getMany();

      this.logger.log(`Found ${ordersToRefund.length} orders eligible for auto-refund`, 'ScheduledTasksService');

      for (const order of ordersToRefund) {
        await this.processAutoRefund(order);
      }
    } catch (error) {
      this.logger.error(`Error in auto-refund task: ${error.message}`, error.stack, 'ScheduledTasksService');
    }
  }

  private async processAutoRefund(order: Order) {
    try {
      // Process refund logic here
      // In a real application, you would call the payment gateway API to process the refund
      // For now, we'll just update the order status
      
      order.returnSuccessDate = new Date();
      order.returnSuccessFlag = 1;
      order.returnPrice = order.orderPrice; // Full refund
      
      await this.orderRepository.save(order);

      // Create a payment record for the refund
      const payment = new Payment();
      payment.orderId = Number(order.id);
      payment.orderNo = order.orderNo;
      payment.payName = 'System Auto Refund';
      payment.payPrice = order.orderPrice;
      payment.type = 1; // 1 for refund
      payment.successFlag = 1; // 1 for success
      payment.requestDate = new Date();
      payment.callbackDate = new Date();
      
      await this.paymentRepository.save(payment);

      this.logger.log(`Processed auto-refund for order: ${order.orderNo}`, 'ScheduledTasksService');
    } catch (error) {
      this.logger.error(`Error processing auto-refund for order ${order.orderNo}: ${error.message}`, error.stack, 'ScheduledTasksService');
    }
  }
}