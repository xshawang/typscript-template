import { BaseQueueModule } from './bullmq.module';
import { Module } from '@nestjs/common';
import { ActivityQueueService } from './service/activity-queue.service';

@Module({
  imports: [BaseQueueModule],
  providers: [ActivityQueueService],
  exports: [ActivityQueueService],
})
export class QueueModule {}
