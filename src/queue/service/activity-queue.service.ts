import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ActivityNoticeDataDto } from '/@/common/dto';

@Injectable()
export class ActivityQueueService {
  constructor(
    @InjectQueue('activity-queue') private readonly activityQueue: Queue,
  ) {}

  async betQueue(data: any, rtp: number) {
    await this.activityQueue.add('bet', { ...data, rtp });
  }
  
  async fundsLogsQueue(data: {
    userId: number;
    account_id: number;
    balance_before: string;
    balance_after: string;
    amount: string | number;
    atype: number; //1.充值 2.提现 3.投注 4.投注返奖 5.活动奖励 6.其他
    remark: string;
  }) {
    await this.activityQueue.add('fund_change', data);
  }

  async noticeQueue(data: ActivityNoticeDataDto) {
    await this.activityQueue.add('notice', data);
  }
}
