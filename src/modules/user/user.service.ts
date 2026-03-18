import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';
import { ChannelsStation } from '../../entities/channels-station.entity';
import { Gift } from '../../entities/gift.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { UserOnlineCachePrefix } from '../../constants/cache';
import { GiftStation } from '../../entities/gift-station.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(ChannelsStation)
    private channelsStationRepository: Repository<ChannelsStation>,
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private jwtService: JwtService,
    private redisService: RedisService,
    @InjectRepository(GiftStation)
    private giftStationRepository: Repository<GiftStation>,
  ) {}

  async loginOrRegister(wxUserInfo: any, ip: string): Promise<{ user: User; token: string }> {
    // Try to find user by openId first
    let user = await this.userRepository.findOne({
      where: { openId: wxUserInfo.openId },
    });

    if (!user) {
      // Create new user if not exists
      user = new User();
      user.phone = wxUserInfo.phoneNumber || null;
      user.img = wxUserInfo.avatarUrl || null;
      user.nickName = wxUserInfo.nickName || `用户${Date.now()}`;
      user.openId = wxUserInfo.openId;
      user.unionId = wxUserInfo.unionId || null;
      user.createDate = new Date();
      user.ip = ip;
      user.channel = wxUserInfo.channel || 'weixin';
      
      user = await this.userRepository.save(user);
    }

    // Generate JWT token
    const payload = { 
      uid: user.id, 
      accountId: user.id, 
      nickname: user.nickName 
    };
    const token = this.jwtService.sign(payload);

    // Store token in Redis for authentication
    await this.redisService.getClient().setex(
      `${UserOnlineCachePrefix}${user.id}`,
      24 * 60 * 60, // 24 hours
      token,
    );

    return { user, token };
  }

  async findByOpenId(openId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { openId } });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async scan(userInfo: {
    openId: string;
    unionId: string;
    nickName: string;
    avatarUrl: string;
    phoneNumber: string;
    channelId: number;
    stationId: number;
  }, ip: string): Promise<{ orders: Order[]; gifts: any[] }> {
    // Check if user exists by openId or unionId
    let user = await this.userRepository.findOne({
      where: [{ openId: userInfo.openId }, { unionId: userInfo.unionId }],
    });

    //如果不存在此用户，则创建新用户。填充景区，营业站点（可以直接查询此channels景区所有的营业站点）channels_station条件为channelId.
    //channel 为景区id，stationId为营业站点id。
    let stations = await this.giftStationRepository.find({
      where: {
        channelId: userInfo.channelId,
      },
    });
    //检查是否存在此营业站点
    let station = stations.find((item) => item.stationId === userInfo.stationId);
    if (!station) {
      throw new Error('营业站点不存在');
    }
    
    if (!user) {
      // Create new user
      user = new User();
      user.phone = userInfo.phoneNumber || null;
      user.img = userInfo.avatarUrl || null;
      user.nickName = userInfo.nickName || `用户${Date.now()}`;
      user.openId = userInfo.openId;
      user.unionId = userInfo.unionId || null;
      user.createDate = new Date();
      user.ip = ip;
      user.channel =  userInfo.channelId || 0;
      user.station = userInfo.stationId || 0;
      user = await this.userRepository.save(user);
    }

    // Query unreturned orders
    const orders = await this.orderRepository.find({
      where: {
        userId: user.id,
        returnDate: null,
      },
    });

    // Query available gifts for the channel and station
    const channelsStations = await this.giftStationRepository.find({
      where: {
        channelId: userInfo.channelId,
        stationId: userInfo.stationId,
        saleNum: MoreThan(0),
      },
    });

    // Get gift details in bulk
    const gifts = [];
    if (channelsStations.length > 0) {
      // Extract all giftIds
      const giftIds = channelsStations.map(cs => cs.giftId);
      
      // Query all gifts at once
      const giftsMap = new Map();
      const giftsList = await this.giftRepository.find({
        where: {
          id: In(giftIds)
        }
      });
      
      // Create giftId to gift map
      for (const gift of giftsList) {
        giftsMap.set(gift.id, gift);
      }
      
      // Build response with gift details
      //暂时所有的物料全部按景区统一处理，目前不考虑站点的差异。数据结构已经保留了。
      for (const cs of channelsStations) {
        const gift = giftsMap.get(cs.giftId);
        if (gift!=null) {
          gifts.push({
            giftId: cs.giftId,
            giftName: gift.giftName,
            giftPrice: gift.giftPrice,
            giftIcon: gift.giftIcon,
            saleNum: cs.saleNum,
            giftType: gift.giftType,
            giftDesc: gift.remark || '',
          });
        }
      }
    }

    return { orders, gifts };
  }

  async pay(userId: number, giftId: number, channelId: number, stationId: number, num: number): Promise<{ order: Order; orderItems: OrderItem[] }> {
    // Get the gift
    const gift = await this.giftRepository.findOne({ where: { id: giftId } });
    if (!gift) {
      throw new Error('物料不存在');
    }

    // Get the channel station
    const channelStation = await this.giftStationRepository.findOne({
      where: {
        giftId,
        channelId,
        stationId,
      },
    });
    if (!channelStation) {
      throw new Error('景区站点物料不存在');
    }

    if (channelStation.saleNum < num) {
      throw new Error('物料库存不足');
    }

    // Create order
    const order = new Order();
    order.orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    order.orderPrice = gift.giftPrice * num;
    order.orderNum = num;
    order.userId = userId;
    order.createDate = new Date();
    order.channelId = channelId;
    order.returnFlag = 0;
    order.returnPrice = 0;
    order.brokePrice = 0;
    order.returnSuccessFlag = 0;

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = [];
    if (gift.giftType === 1) {
      // Packaging material, parse giftDesc
      try {
        const giftItems = JSON.parse(gift.giftDesc);
        for (const item of giftItems) {
          const orderItem = new OrderItem();
          orderItem.orderNo = savedOrder.orderNo;
          orderItem.giftId = item.id;
          orderItem.giftName = item.name;
          orderItem.giftNum = item.num * num;
          orderItem.giftPrice = gift.giftPrice / giftItems.length;
          orderItem.createDate = new Date();
          orderItem.returnNum = 0;
          
          const savedItem = await this.orderItemRepository.save(orderItem);
          orderItems.push(savedItem);
        }
      } catch (error) {
        throw new Error('包装物料解析失败');
      }
    } else {
      // Regular material
      const orderItem = new OrderItem();
      orderItem.orderNo = savedOrder.orderNo;
      orderItem.giftId = giftId;
      orderItem.giftName = channelStation.giftName;
      orderItem.giftNum = num;
      orderItem.giftPrice = gift.giftPrice;
      orderItem.createDate = new Date();
      orderItem.returnNum = 0;
      
      const savedItem = await this.orderItemRepository.save(orderItem);
      orderItems.push(savedItem);
    }

    // Update saleNum
    channelStation.saleNum -= num;
    await this.channelsStationRepository.save(channelStation);

    return { order: savedOrder, orderItems };
  }
}