import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { QueueModule } from '/@/queue/queue.module';
import { RedisLockService } from '/@/shared/services/redis-lock.service';
import { RtpService } from '/@/repositories/rtp.service';

@Module({
  imports: [QueueModule],
  controllers: [SystemController],
  providers: [SystemService, RedisLockService, RtpService],
})
export class SystemModule {}
