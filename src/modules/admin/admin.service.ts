import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AdminMemberEntity } from '../../entities/admin/admin-member.entity';
import { ScenicGiftEntity } from '../../entities/scenic/scenic-gift.entity';
import { ScenicChannelEntity } from '../../entities/scenic/scenic-channel.entity';
import { UserOrderEntity } from '../../entities/order/user-order.entity';
import { PayDetailEntity } from '../../entities/payment/pay-detail.entity';
import { OrderGiftEntity } from '../../entities/order/order-gift.entity';
import { AdminLoginDto, GiftEditDto, ProcessReturnDto, ChannelAddDto, GiftManageDto } from './admin.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthService } from '../../common/jwt-auth.service';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminMemberEntity)
    private adminMemberRepository: Repository<AdminMemberEntity>,
    @InjectRepository(ScenicGiftEntity)
    private scenicGiftRepository: Repository<ScenicGiftEntity>,
    @InjectRepository(ScenicChannelEntity)
    private scenicChannelRepository: Repository<ScenicChannelEntity>,
    @InjectRepository(UserOrderEntity)
    private userOrderRepository: Repository<UserOrderEntity>,
    @InjectRepository(PayDetailEntity)
    private payDetailRepository: Repository<PayDetailEntity>,
    @InjectRepository(OrderGiftEntity)
    private orderGiftRepository: Repository<OrderGiftEntity>,
    private jwtAuthService: JwtAuthService,
  ) {}

  async login(loginDto: AdminLoginDto): Promise<{ code: number; msg: string; token?: string }> {
    try {
      // 验证管理员信息
      const admin = await this.adminMemberRepository.findOne({
        where: {
          username: loginDto.userName,
          password: loginDto.password, // 假设前端已进行MD5加密
        },
      });

      if (!admin) {
        return { code: 1, msg: '用户名或密码错误' };
      }

      // 更新设备ID
      admin.deviceId = loginDto.deviceId;
      await this.adminMemberRepository.save(admin);

      // 生成JWT token
      const tokenPayload = {
        adminId: admin.id,
        username: admin.username,
        roleType: admin.roleType,
        type: 'backend',
        role: admin.roleType === 2 ? 'admin' : 'operator',
      };
      const token = this.jwtAuthService.generateBackendToken(tokenPayload);

      return { code: 0, msg: '登录成功', token };
    } catch (error) {
      this.logger.error('管理员登录失败:', error);
      return { code: 1, msg: '登录失败' };
    }
  }

  async editGift(giftEditDto: GiftEditDto): Promise<{ code: number; msg: string }> {
    try {
      const gift = await this.scenicGiftRepository.findOne({
        where: { id: giftEditDto.id },
      });

      if (!gift) {
        return { code: 1, msg: '物品不存在' };
      }

      // 更新可选字段
      if (giftEditDto.giftPrice !== undefined) {
        gift.giftPrice = giftEditDto.giftPrice;
      }
      if (giftEditDto.giftNum !== undefined) {
        gift.giftNum = giftEditDto.giftNum;
      }
      if (giftEditDto.vstatus !== undefined) {
        gift.vstatus = giftEditDto.vstatus;
      }

      await this.scenicGiftRepository.save(gift);

      return { code: 0, msg: '修改成功' };
    } catch (error) {
      this.logger.error('修改物品失败:', error);
      return { code: 1, msg: '修改失败' };
    }
  }

  async processReturn(processReturnDto: ProcessReturnDto): Promise<{ code: number; msg: string }> {
    try {
      // 查找订单
      const order = await this.userOrderRepository.findOne({
        where: { orderNo: processReturnDto.orderNo },
      });

      if (!order) {
        return { code: 1, msg: '订单不存在' };
      }

      if (order.returnSuccessFlag === 1) {
        return { code: 1, msg: '订单已处理退还' };
      }

      if (!order.returnDate) {
        return { code: 1, msg: '订单尚未申请退还' };
      }

      // 这里应该有实际的退款逻辑，暂时模拟
      order.returnSuccessDate = new Date();
      order.returnSuccessFlag = 1;
      await this.userOrderRepository.save(order);

      // 创建退款支付详情记录
      const payDetail = new PayDetailEntity();
      payDetail.payName = '退还处理';
      payDetail.orderNo = processReturnDto.orderNo;
      payDetail.orderId = order.id;
      payDetail.payPrice = order.orderPrice;
      payDetail.type = 1; // 1 退还
      payDetail.successFlag = 1; // 成功
      await this.payDetailRepository.save(payDetail);

      // 更新订单物料退还信息
      const orderGifts = await this.orderGiftRepository.find({
        where: { orderNo: processReturnDto.orderNo },
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

      return { code: 0, msg: '退还处理成功' };
    } catch (error) {
      this.logger.error('退还处理失败:', error);
      return { code: 1, msg: '退还处理失败' };
    }
  }

  async addChannel(channelAddDto: ChannelAddDto): Promise<{ code: number; msg: string }> {
    try {
      // 检查景区编码是否已存在
      const existingChannel = await this.scenicChannelRepository.findOne({
        where: { channel: channelAddDto.channel },
      });

      if (existingChannel) {
        return { code: 1, msg: '景区编码已存在' };
      }

      const channel = new ScenicChannelEntity();
      channel.channel = channelAddDto.channel;
      channel.channelName = channelAddDto.channelName;
      channel.city = channelAddDto.city;
      channel.star = channelAddDto.star || 0;
      channel.remark = channelAddDto.remark;
      channel.phone = channelAddDto.phone;

      await this.scenicChannelRepository.save(channel);

      return { code: 0, msg: '添加景区成功' };
    } catch (error) {
      this.logger.error('添加景区失败:', error);
      return { code: 1, msg: '添加景区失败' };
    }
  }

  async manageGift(giftManageDto: GiftManageDto): Promise<{ code: number; msg: string }> {
    try {
      // 检查景区是否存在
      const channel = await this.scenicChannelRepository.findOne({
        where: { id: giftManageDto.channelId },
      });

      if (!channel) {
        return { code: 1, msg: '景区不存在' };
      }

      // 检查物品是否已存在
      let gift = await this.scenicGiftRepository.findOne({
        where: {
          giftName: giftManageDto.giftName,
          channelId: giftManageDto.channelId,
        },
      });

      if (gift) {
        // 更新现有物品
        gift.giftPrice = giftManageDto.giftPrice;
        gift.giftNum = giftManageDto.giftNum;
        if (giftManageDto.vstatus !== undefined) {
          gift.vstatus = giftManageDto.vstatus;
        }
      } else {
        // 创建新物品
        gift = new ScenicGiftEntity();
        gift.giftName = giftManageDto.giftName;
        gift.giftPrice = giftManageDto.giftPrice;
        gift.giftNum = giftManageDto.giftNum;
        gift.channelId = giftManageDto.channelId;
        gift.vstatus = giftManageDto.vstatus || 0;
      }

      await this.scenicGiftRepository.save(gift);

      return { code: 0, msg: gift.id ? '更新物品成功' : '添加物品成功' };
    } catch (error) {
      this.logger.error('管理物品失败:', error);
      return { code: 1, msg: '管理物品失败' };
    }
  }

  verifyToken(token: string) {
    if (!token) {
      return null;
    }
    return this.jwtAuthService.verifyBackendToken(token);
  }
}