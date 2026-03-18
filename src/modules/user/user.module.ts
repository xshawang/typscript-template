import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';
import { ChannelsStation } from '../../entities/channels-station.entity';
import { Gift } from '../../entities/gift.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { GiftStation } from '../../entities/gift-station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, ChannelsStation, Gift, OrderItem, GiftStation]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}