import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('gifts')
export class Gift extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, comment: '名称',name: 'gift_name' })
  giftName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, comment: '价格',name: 'gift_price' })
  giftPrice: number;

  @Column({ type: 'int', nullable: true, default: 0, comment: '数量',name: 'gift_num' })
  giftNum: number;

  @Column({ type: 'bigint', name: 'channel_id', nullable: false, comment: '景区ID' })
  channelId: number;

  @Column({ type: 'tinyint', default: 0, comment: '销售状态 0-销售 1-不销售' })
  vstatus: number; // 0 for sale, 1 for not for sale
}