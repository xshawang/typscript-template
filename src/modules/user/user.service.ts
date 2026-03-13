import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, getConnection } from 'typeorm';
import { UserEntity } from '../../entities/user/user.entity';
import { UserOrderEntity } from '../../entities/order/user-order.entity';
import { ScenicGiftEntity } from '../../entities/scenic/scenic-gift.entity';
import { OrderGiftEntity } from '../../entities/order/order-gift.entity';
import { PayDetailEntity } from '../../entities/payment/pay-detail.entity';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { RedisLockService } from '../../shared/services/redis-lock.service';
import { PayDepositDto, PayDepositItemDto } from './user.dto';
import { JwtAuthService } from '../../common/jwt-auth.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrderEntity)
    private userOrderRepository: Repository<UserOrderEntity>,
    @InjectRepository(ScenicGiftEntity)
    private scenicGiftRepository: Repository<ScenicGiftEntity>,
    @InjectRepository(OrderGiftEntity)
    private orderGiftRepository: Repository<OrderGiftEntity>,
    @InjectRepository(PayDetailEntity)
    private payDetailRepository: Repository<PayDetailEntity>,
    private redisService: RedisService,
    private redisLockService: RedisLockService,
    private jwtAuthService: JwtAuthService,
  ) {}

  async login(code: string): Promise<{ token: string; userInfo: UserEntity }> {
    // 这里模拟微信登录逻辑，实际应用中需要调用微信API
    // 为了演示，我们直接创建或获取用户
    let user = await this.userRepository.findOne({
      where: { openId: `mock_openid_${code}` },
    });

    if (!user) {
      user = new UserEntity();
      user.openId = `mock_openid_${code}`;
      user.nickName = `用户${Date.now()}`;
      user.createDate = new Date();
      user = await this.userRepository.save(user);
    }

    // 生成JWT token
    const tokenPayload = {
      userId: user.id,
      openId: user.openId,
      type: 'frontend',
      role: 'user',
    };
    const token = this.jwtAuthService.generateFrontendToken(tokenPayload);

    return { token, userInfo: user };
  }

  async payDeposit(userId: number, payDepositDto: PayDepositDto): Promise<{ code: number; msg: string; orderNo?: string }> {
    try {
      // 验证物品是否存在且价格正确
      const giftIds = payDepositDto.items.map(item => item.giftId);
      const gifts = await this.scenicGiftRepository.findBy({
        id: In(giftIds),
      });

      if (gifts.length !== giftIds.length) {
        return { code: 1, msg: '部分物品不存在' };
      }

      // 验证库存和价格
      for (const item of payDepositDto.items) {
        const gift = gifts.find(g => g.id === item.giftId);
        if (!gift) {
          return { code: 1, msg: `物品${item.giftId}不存在` };
        }
        if (gift.vstatus !== 0) {
          return { code: 1, msg: `物品${gift.giftName}暂不可租借` };
        }
        if (gift.giftNum < item.giftNum) {
          return { code: 1, msg: `物品${gift.giftName}库存不足` };
        }
        if (gift.giftPrice !== item.giftPrice) {
          return { code: 1, msg: `物品${gift.giftName}价格已变动` };
        }
      }

      // 创建订单
      const orderNo = `ORDER${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const totalAmount = payDepositDto.items.reduce((sum, item) => sum + (item.giftPrice * item.giftNum), 0);

      const order = new UserOrderEntity();
      order.orderNo = orderNo;
      order.orderPrice = totalAmount;
      order.orderNum = payDepositDto.items.reduce((sum, item) => sum + item.giftNum, 0);
      order.userId = userId;
      order.channelId = 1; // 默认景区ID，实际应用中应从用户信息或其他途径获取
      await this.userOrderRepository.save(order);

      // 创建订单物料记录
      for (const item of payDepositDto.items) {
        const gift = gifts.find(g => g.id === item.giftId);
        
        const orderGift = new OrderGiftEntity();
        orderGift.orderNo = orderNo;
        orderGift.giftId = item.giftId;
        orderGift.giftName = gift.giftName;
        orderGift.giftNum = item.giftNum;
        orderGift.giftPrice = item.giftPrice;
        await this.orderGiftRepository.save(orderGift);

        // 减少库存
        gift.giftNum -= item.giftNum;
        await this.scenicGiftRepository.save(gift);
      }

      // 创建支付详情记录
      const payDetail = new PayDetailEntity();
      payDetail.payName = '押金支付';
      payDetail.orderNo = orderNo;
      payDetail.orderId = order.id;
      payDetail.payPrice = totalAmount;
      payDetail.type = 0; // 0 支付
      await this.payDetailRepository.save(payDetail);

      return { code: 0, msg: '支付押金成功', orderNo };
    } catch (error) {
      this.logger.error('支付押金失败:', error);
      return { code: 1, msg: '支付押金失败' };
    }
  }

  async getOrderList(userId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      // 查询用户的订单，未退还在前，按时间倒序
      const orders = await this.userOrderRepository.find({
        where: { userId },
        order: {
          returnSuccessFlag: 'ASC', // 未退还的在前
          createDate: 'DESC',       // 时间倒序
        },
        skip,
        take: limit,
      });

      const totalCount = await this.userOrderRepository.count({ where: { userId } });

      return {
        code: 0,
        msg: '获取订单列表成功',
        list: orders,
        total: totalCount
      };
    } catch (error) {
      this.logger.error('获取订单列表失败:', error);
      return { code: 1, msg: '获取订单列表失败', list: [], total: 0 };
    }
  }

  async applyReturn(userId: number, orderNo: string) {
    try {
      // 查找订单
      const order = await this.userOrderRepository.findOne({
        where: { orderNo, userId }
      });

      if (!order) {
        return { code: 1, msg: '订单不存在' };
      }

      if (order.returnDate) {
        return { code: 1, msg: '已申请退还，请勿重复操作' };
      }

      // 更新订单状态
      order.returnDate = new Date();
      await this.userOrderRepository.save(order);

      return { code: 0, msg: '申请退还成功' };
    } catch (error) {
      this.logger.error('申请退还失败:', error);
      return { code: 1, msg: '申请退还失败' };
    }
  }

  verifyToken(token: string) {
    if (!token) {
      return null;
    }
    return this.jwtAuthService.verifyFrontendToken(token);
  }
}