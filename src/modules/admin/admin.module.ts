import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { AdminMemberEntity } from '../../entities/admin/admin-member.entity';
import { ScenicGiftEntity } from '../../entities/scenic/scenic-gift.entity';
import { ScenicChannelEntity } from '../../entities/scenic/scenic-channel.entity';
import { UserOrderEntity } from '../../entities/order/user-order.entity';
import { PayDetailEntity } from '../../entities/payment/pay-detail.entity';
import { OrderGiftEntity } from '../../entities/order/order-gift.entity';
import { JwtAuthService } from '../../common/jwt-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminMemberEntity,
      ScenicGiftEntity,
      ScenicChannelEntity,
      UserOrderEntity,
      PayDetailEntity,
      OrderGiftEntity,
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtConfig.secret,
        signOptions: { expiresIn: configService.jwtConfig.expires },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AdminController, DataController],
  providers: [AdminService, DataService, JwtAuthService],
  exports: [AdminService, DataService],
})
export class AdminModule {}