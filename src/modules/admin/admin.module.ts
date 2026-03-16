import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminOperationsService } from './services/admin-operations.service';
import { AdminController } from './admin.controller';
import { Admin } from '../../entities/admin.entity';
import { Gift } from '../../entities/gift.entity';
import { Channel } from '../../entities/channel.entity';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Gift, Channel, Order]),
  ],
  providers: [AdminService, AdminOperationsService],
  controllers: [AdminController],
  exports: [AdminService, AdminOperationsService],
})
export class AdminModule {}