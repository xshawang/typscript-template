import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from '../../../entities/gift.entity';
import { Channel } from '../../../entities/channel.entity';
import { Order } from '../../../entities/order.entity';
import { ProcessRefundDto } from '../dto/admin-login.dto';
import { OrderItem } from '../../../entities/order-item.entity';

@Injectable()
export class AdminOperationsService {
  constructor(
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async updateGift(giftId: number, updateData: { giftPrice?: number; giftNum?: number; vstatus?: number }): Promise<Gift> {
    const gift = await this.giftRepository.findOne({ where: { id: giftId } });
    
    if (!gift) {
      throw new Error('礼品不存在');
    }

    // Update only provided fields
    if (updateData.giftPrice !== undefined) {
      gift.giftPrice = updateData.giftPrice;
    }
    if (updateData.giftNum !== undefined) {
      gift.giftNum = updateData.giftNum;
    }
    if (updateData.vstatus !== undefined) {
      gift.vstatus = updateData.vstatus;
    }

    return await this.giftRepository.save(gift);
  }

  async processRefund(processDto: ProcessRefundDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { orderNo: processDto.orderNo } });
    
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.returnSuccessFlag === 1) {
      throw new Error('订单已处理退还');
    }
    if(processDto.items.length === 0) {
      throw new Error('请选择要退还的物品');
    }
    const orderItemMap = new Map(processDto.items.map(item => [item.giftId, item]));
    // if (!order.returnDate) {
    //   throw new Error('订单尚未申请退还');
    // }

    const refundAmount = processDto.items.reduce((acc, item) => acc + Number(item.cost), 0);
    if (refundAmount > order.orderPrice) {
      throw new Error('退款金额不能超过订单金额');
    }
    order.returnDate = new Date();
    // Process the refund
    order.returnSuccessDate = new Date();
    order.returnSuccessFlag = 1;
    order.returnPrice = refundAmount; // Full refund

    const orderItems = await this.orderItemRepository.find({ where: { orderNo: processDto.orderNo } });
    return await this.orderRepository.save(order);
  }

  async createOrUpdateChannel(channelData: { id?: number; channel: string; channelName: string; city?: string; star?: number; remark?: string; phone?: string }): Promise<Channel> {
    let channel: Channel;
    
    if (channelData.id) {
      // Update existing channel
      channel = await this.channelRepository.findOne({ where: { id: channelData.id } });
      if (!channel) {
        throw new Error('景区不存在');
      }
    } else {
      // Create new channel
      channel = new Channel();
    }

    channel.channel = channelData.channel;
    channel.channelName = channelData.channelName;
    channel.city = channelData.city || channel.city;
    channel.star = channelData.star !== undefined ? channelData.star : channel.star;
    channel.remark = channelData.remark || channel.remark;
    channel.phone = channelData.phone || channel.phone;

    return await this.channelRepository.save(channel);
  }

  async createOrUpdateGift(giftData: { id?: number; giftName: string; giftPrice: number; giftNum: number; channelId: number; vstatus?: number }): Promise<Gift> {
    let gift: Gift;
    
    if (giftData.id) {
      // Update existing gift
      gift = await this.giftRepository.findOne({ where: { id: giftData.id } });
      if (!gift) {
        throw new Error('礼品不存在');
      }
    } else {
      // Create new gift
      gift = new Gift();
    }

    gift.giftName = giftData.giftName;
    gift.giftPrice = giftData.giftPrice;
    gift.giftNum = giftData.giftNum;
    gift.channelId = giftData.channelId;
    gift.vstatus = giftData.vstatus !== undefined ? giftData.vstatus : gift.vstatus;

    return await this.giftRepository.save(gift);
  }

  async getDashboardData(): Promise<{
    dailyPaymentCount: number;
    dailyPaymentAmount: number;
    dailyRefundCount: number;
    dailyRefundAmount: number;
    monthlyPaymentCount: number;
    monthlyPaymentAmount: number;
    monthlyRefundCount: number;
    monthlyRefundAmount: number;
    totalPaymentCount: number;
    totalPaymentAmount: number;
    totalRefundCount: number;
    totalRefundAmount: number;
    totalProfit: number;
  }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Daily payment data
    const dailyPaymentResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.orderPrice) as amount'
      ])
      .where('order.createDate >= :todayStart AND order.createDate <= :todayEnd', { todayStart, todayEnd })
      .andWhere('(order.returnSuccessFlag IS NULL OR order.returnSuccessFlag = 0)')
      .getRawOne();

    // Daily refund data
    const dailyRefundResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.returnPrice) as amount'
      ])
      .where('order.returnSuccessDate >= :todayStart AND order.returnSuccessDate <= :todayEnd', { todayStart, todayEnd })
      .andWhere('order.returnSuccessFlag = 1')
      .getRawOne();

    // Monthly payment data
    const monthlyPaymentResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.orderPrice) as amount'
      ])
      .where('order.createDate >= :monthStart', { monthStart })
      .andWhere('(order.returnSuccessFlag IS NULL OR order.returnSuccessFlag = 0)')
      .getRawOne();

    // Monthly refund data
    const monthlyRefundResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.returnPrice) as amount'
      ])
      .where('order.returnSuccessDate >= :monthStart', { monthStart })
      .andWhere('order.returnSuccessFlag = 1')
      .getRawOne();

    // Total payment data
    const totalPaymentResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.orderPrice) as amount'
      ])
      .where('(order.returnSuccessFlag IS NULL OR order.returnSuccessFlag = 0)')
      .getRawOne();

    // Total refund data
    const totalRefundResult = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(order.id) as count',
        'SUM(order.returnPrice) as amount'
      ])
      .where('order.returnSuccessFlag = 1')
      .getRawOne();

    return {
      dailyPaymentCount: parseInt(dailyPaymentResult.count) || 0,
      dailyPaymentAmount: parseFloat(dailyPaymentResult.amount) || 0,
      dailyRefundCount: parseInt(dailyRefundResult.count) || 0,
      dailyRefundAmount: parseFloat(dailyRefundResult.amount) || 0,
      monthlyPaymentCount: parseInt(monthlyPaymentResult.count) || 0,
      monthlyPaymentAmount: parseFloat(monthlyPaymentResult.amount) || 0,
      monthlyRefundCount: parseInt(monthlyRefundResult.count) || 0,
      monthlyRefundAmount: parseFloat(monthlyRefundResult.amount) || 0,
      totalPaymentCount: parseInt(totalPaymentResult.count) || 0,
      totalPaymentAmount: parseFloat(totalPaymentResult.amount) || 0,
      totalRefundCount: parseInt(totalRefundResult.count) || 0,
      totalRefundAmount: parseFloat(totalRefundResult.amount) || 0,
      totalProfit: (parseFloat(totalPaymentResult.amount) || 0) - (parseFloat(totalRefundResult.amount) || 0),
    };
  }
}