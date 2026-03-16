import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Gift } from '../../entities/gift.entity';
import { User } from '../../entities/user.entity';
import { Channel } from '../../entities/channel.entity';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createDepositOrder(userId: number, items: Array<{ giftId: number; quantity: number; price: number }>): Promise<Order> {
    // Validate user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    // Get all gift details
    const giftIds = items.map(item => item.giftId);
    const gifts = await this.giftRepository.findBy({ id: In(giftIds) });

    // Validate gifts exist and are available for sale
    for (const item of items) {
      const gift = gifts.find(g => g.id === item.giftId);
      if (!gift) {
        throw new Error(`物品ID ${item.giftId} 不存在`);
      }
      if (gift.vstatus !== 0) {
        throw new Error(`物品 ${gift.giftName} 当前不可销售`);
      }
      if (gift.giftPrice !== item.price) {
        throw new Error(`物品 ${gift.giftName} 价格不正确`);
      }
      if (gift.giftNum < item.quantity) {
        throw new Error(`物品 ${gift.giftName} 库存不足`);
      }
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const gift = gifts.find(g => g.id === item.giftId);
      totalPrice += item.price * item.quantity;
    }

    // Find the channel for the first gift (assuming all gifts belong to the same channel)
    const firstGift = gifts[0];
    const channel = await this.channelRepository.findOne({ where: { id: Number(firstGift.channelId) } });
    if (!channel) {
      throw new Error('景区信息不存在');
    }

    // Create order
    const order = new Order();
    order.orderNo = this.generateOrderNo();
    order.orderPrice = totalPrice;
    order.orderNum = items.reduce((sum, item) => sum + item.quantity, 0);
    order.userId = userId;
    order.createDate = new Date();
    order.channelId = channel.id;
    // Note: Pay date, callback date, and pay channel will be set after actual payment
    
    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const item of items) {
      const gift = gifts.find(g => g.id === item.giftId);
      const orderItem = new OrderItem();
      orderItem.orderNo = savedOrder.orderNo;
      orderItem.giftId = item.giftId;
      orderItem.giftName = gift.giftName;
      orderItem.giftNum = item.quantity;
      orderItem.giftPrice = item.price;
      orderItem.createDate = new Date();
      
      await this.orderItemRepository.save(orderItem);

      // Update gift inventory
      gift.giftNum -= item.quantity;
      await this.giftRepository.save(gift);
    }

    return savedOrder;
  }

  async getUserOrdersWithNoRefund(userId: number): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .andWhere('(order.returnSuccessFlag IS NULL OR order.returnSuccessFlag = 0)')
      .orderBy('order.createDate', 'DESC')
      .getMany();
  }

  async applyForRefund(orderNo: string, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNo, userId }
    });

    if (!order) {
      throw new Error('订单不存在或不属于当前用户');
    }

    if (order.returnDate) {
      throw new Error('该订单已申请退还');
    }

    order.returnDate = new Date();
    return await this.orderRepository.save(order);
  }

  private generateOrderNo(): string {
    // Generate a 32-character random unique order number
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 15);
    let orderNo = `ORD${timestamp}${randomPart}`;
    // Ensure it's exactly 32 characters
    if (orderNo.length > 32) {
      orderNo = orderNo.substring(0, 32);
    } else if (orderNo.length < 32) {
      orderNo = orderNo.padEnd(32, '0');
    }
    return orderNo;
  }
}