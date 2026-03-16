import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('order_items')
export class OrderItem extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, name: 'order_no', nullable: false, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'int', name: 'gift_id', nullable: false, comment: '物品id' })
  giftId: number;

  @Column({ type: 'varchar', length: 100, name: 'gift_name', nullable: false, comment: '物品名称' })
  giftName: string;

  @Column({ type: 'int', name: 'gift_num', nullable: true, default: 1, comment: '物品数量' })
  giftNum: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'gift_price', nullable: false, comment: '物品价格' })
  giftPrice: number;

  @Column({ type: 'datetime', name: 'create_date', nullable: true, comment: '创建时间' })
  createDate: Date;

  @Column({ type: 'datetime', name: 'return_date', nullable: true, comment: '退还时间' })
  returnDate: Date;

  @Column({ type: 'int', name: 'return_num', nullable: true, default: 0, comment: '退还数量' })
  returnNum: number;
}