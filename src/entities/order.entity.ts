import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('orders')
export class Order extends AbstractEntity {
  @Column({ type: 'varchar', name: 'order_no', length: 50, unique: true, nullable: false, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'decimal', name: 'order_price', precision: 10, scale: 2, nullable: false, comment: '订单价格' })
  orderPrice: number;

  @Column({ type: 'int', name: 'order_num', nullable: true, default: 1, comment: '数量' })
  orderNum: number;

  @Column({ type: 'bigint', name: 'user_id', nullable: false, comment: '会员id' })
  userId: number;

  @Column({ type: 'datetime', name: 'create_date', nullable: true, comment: '生成订单时间' })
  createDate: Date;

  @Column({ type: 'datetime', name: 'pay_date', nullable: true, comment: '支付时间' })
  payDate: Date;

  @Column({ type: 'datetime', name: 'callback_date', nullable: true, comment: '回调确认成功时间' })
  callbackDate: Date;

  @Column({ type: 'varchar', length: 50, name: 'pay_channel', nullable: true, comment: '支付渠道' })
  payChannel: string;

  @Column({ type: 'bigint', name: 'channel_id', nullable: false, comment: '景区ID' })
  channelId: number;

  @Column({ type: 'datetime', name: 'return_date', nullable: true, comment: '申请退还时间' })
  returnDate: Date;

  @Column({ type: 'int', name: 'return_flag', nullable: true, default: 0, comment: '退还物品数量' })
  returnFlag: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'return_price', nullable: true, default: 0.00, comment: '退还金额' })
  returnPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'broke_price', nullable: true, default: 0.00, comment: '损耗金额' })
  brokePrice: number;

  @Column({ type: 'datetime', name: 'return_sucess_date', nullable: true, comment: '退还成功时间' })
  returnSuccessDate: Date;

  @Column({ type: 'tinyint', name: 'return_sucess_flag', nullable: true, default: 0, comment: '退还成功标记 1-成功' })
  returnSuccessFlag: number; // 0 for not successful, 1 for successful
}