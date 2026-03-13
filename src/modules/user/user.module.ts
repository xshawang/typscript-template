import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '../../entities/user/user.entity';
import { UserOrderEntity } from '../../entities/order/user-order.entity';
import { ScenicGiftEntity } from '../../entities/scenic/scenic-gift.entity';
import { OrderGiftEntity } from '../../entities/order/order-gift.entity';
import { PayDetailEntity } from '../../entities/payment/pay-detail.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisLockService } from '../../shared/services/redis-lock.service';
import { JwtAuthService } from '../../common/jwt-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserOrderEntity,
      ScenicGiftEntity,
      OrderGiftEntity,
      PayDetailEntity,
    ]),
    RedisModule,
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtConfig.secret,
        signOptions: { expiresIn: configService.jwtConfig.expires },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, RedisLockService, JwtAuthService],
  exports: [UserService],
})
export class UserModule {}