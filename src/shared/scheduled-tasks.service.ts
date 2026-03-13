import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrderEntity } from '../entities/order/user-order.entity';
import { PayDetailEntity } from '../entities/payment/pay-detail.entity';
import { OrderGiftEntity } from '../entities/order/order-gift.entity';
import { ScenicGiftEntity } from '../entities/scenic/scenic-gift.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ScheduledTasksService {
  private logger = new Logger(ScheduledTasksService.name);

  constructor(
    @InjectRepository(UserOrderEntity)
    private userOrderRepository: Repository<UserOrderEntity>,
    @InjectRepository(PayDetailEntity)
    private payDetailRepository: Repository<PayDetailEntity>,
    @InjectRepository(OrderGiftEntity)
    private orderGiftRepository: Repository<OrderGiftEntity>,
    @InjectRepository(ScenicGiftEntity)
    private scenicGiftRepository: Repository<ScenicGiftEntity>,
  ) {}

  // 每天凌晨2点执行定时任务，处理超过3天未处理的退还申请
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleReturnOrders() {
    this.logger.debug('开始执行退还订单定时任务');

    try {
      // 查找申请退还时间超过3天且未处理的订单
      const threeDaysAgo = dayjs().subtract(3, 'day').toDate();
      const ordersToProcess = await this.userOrderRepository
        .createQueryBuilder('order')
        .where('order.return_date <= :threeDaysAgo', { threeDaysAgo })
        .andWhere('order.return_success_flag != :flag', { flag: 1 })
        .getMany();

      this.logger.debug(`找到 ${ordersToProcess.length} 个需要处理的退还订单`);

      for (const order of ordersToProcess) {
        try {
          // 处理退还逻辑
          await this.processReturnOrder(order);
          this.logger.debug(`成功处理订单: ${order.orderNo}`);
        } catch (error) {
          this.logger.error(`处理订单 ${order.orderNo} 失败:`, error);
        }
      }

      this.logger.debug('退还订单定时任务执行完毕');
    } catch (error) {
      this.logger.error('退还订单定时任务执行失败:', error);
    }
  }

  private async processReturnOrder(order: UserOrderEntity) {
    // 更新订单状态
    order.returnSuccessDate = new Date();
    order.returnSuccessFlag = 1;
    await this.userOrderRepository.save(order);

    // 创建退款支付详情记录
    const payDetail = new PayDetailEntity();
    payDetail.payName = '自动退还处理';
    payDetail.orderNo = order.orderNo;
    payDetail.orderId = order.id;
    payDetail.payPrice = order.orderPrice;
    payDetail.type = 1; // 1 退还
    payDetail.successFlag = 1; // 成功
    await this.payDetailRepository.save(payDetail);

    // 更新订单物料退还信息
    const orderGifts = await this.orderGiftRepository.find({
      where: { orderNo: order.orderNo },
    });

    for (const orderGift of orderGifts) {
      orderGift.returnDate = new Date();
      orderGift.returnNum = orderGift.giftNum; // 全部退还
      await this.orderGiftRepository.save(orderGift);

      // 增加库存
      const gift = await this.scenicGiftRepository.findOne({
        where: { id: orderGift.giftId },
      });
      if (gift) {
        gift.giftNum += orderGift.giftNum;
        await this.scenicGiftRepository.save(gift);
      }
    }
  }
}