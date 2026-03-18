import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('gift_station')
export class GiftStation extends AbstractEntity {
@Column({ type: 'int', name: 'gift_id', nullable: false, comment: '物料ID' })
  giftId: number;

  @Column({ type: 'varchar', length: 100, name: 'gift_name', nullable: false, comment: '对外展示的商品名' })
  giftName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'gift_price', nullable: false, comment: '物料价格' })
  giftPrice: number;

  @Column({ type: 'int', name: 'gift_num', nullable: false, comment: '物料数量' })
  giftNum: number;

  @Column({ type: 'varchar', length: 255, name: 'gift_icon', nullable: true, comment: '图标' })
  giftIcon: string;

  @Column({ type: 'int', name: 'channel_id', nullable: false, comment: '景区id' })
  channelId: number;

  @Column({ type: 'int', name: 'station_id', nullable: false, comment: '站点id' })
  stationId: number;

  @Column({ type: 'varchar', length: 255, name: 'remark', nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'datetime', name: 'create_time', nullable: true, comment: '创建时间' })
  createTime: Date;

  @Column({ type: 'int', name: 'sale_num', nullable: false, default: 0, comment: '对外可售数量' })
  saleNum: number;
}