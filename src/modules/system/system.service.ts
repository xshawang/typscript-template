import { Injectable, Logger } from '@nestjs/common';
import { NoticeListDto } from './system.dto';
import { AbstractService } from '/@/common/abstract.service';
import { NoticeEntity } from '/@/entities/system/notice.entity';
import { AppConfigService } from '/@/shared/services/app-config.service';
import { ApiFailedException } from '/@/exceptions/api-failed.exception';
import { ErrorEnum } from '/@/constants/errorx';
import { HttpService } from '@nestjs/axios';
import { RedisLockService } from '/@/shared/services/redis-lock.service';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class SystemService extends AbstractService {
  constructor(
    private readonly httpServer: HttpService,
    private readonly redisLockService: RedisLockService,
    private readonly redisService: RedisService,
    private readonly configService: AppConfigService,
  ) {
    super();
  }

  private logger = new Logger('SystemService');

  async systemConfig() {
    const depoistAmounts = [ 200, 500, 1000, 2000, 5000,10000,20000,50000];//100-50000[mpay]
    const pay_num_min = 200;
    const pay_num_max = 50000;
    const withdraw_num_min = 200;
    const withdraw_num_max = 50000;
    const pay_name = 'GAPPAY';
    return {
      depoistAmounts,
      pay_num_min,
      pay_num_max,
      withdraw_num_min,
      withdraw_num_max,
      pay_name,
    };
  }

  async unreadNoticeCount(uid: number): Promise<number> {
    const count = await this.entityManager.count(NoticeEntity, {
      where: { userId: uid, isRead: 0 },
    });
    return count;
  }

  async noticeList(uid: number): Promise<NoticeListDto> {
    const list = await this.entityManager.find(NoticeEntity, {
      where: { userId: uid },
      order: { createTime: 'DESC' },
    });
    return new NoticeListDto(list);
  }

  async noticeRead(userId: number, id: number, all: boolean): Promise<void> {
    if (all) {
      await this.entityManager.update(
        NoticeEntity,
        { userId: userId },
        { isRead: 1 },
      );
      return;
    }
    await this.entityManager.update(
      NoticeEntity,
      {
        id: id,
        userId: userId,
      },
      { isRead: 1 },
    );
  }
  
}