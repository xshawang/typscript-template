import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('payments')
export class Payment extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, name: 'pay_name', nullable: false, comment: '支付渠道' })
  payName: string;

  @Column({ type: 'text', name: 'pay_param', nullable: true, comment: '请求参数' })
  payParam: string;

  @Column({ type: 'datetime', name: 'request_date', nullable: true, comment: '请求时间' })
  requestDate: Date;

  @Column({ type: 'text', name: 'response_data', nullable: true, comment: '返回数据' })
  responseData: string;

  @Column({ type: 'int', name: 'req_num', nullable: true, default: 1, comment: '第几次请求' })
  reqNum: number;

  @Column({ type: 'tinyint', name: 'sucess_flag', nullable: true, default: 0, comment: '成功与否标志 1-成功 0-初始化' })
  successFlag: number; // 0 for init, 1 for success

  @Column({ type: 'datetime', name: 'callback_date', nullable: true, comment: '回调时间' })
  callbackDate: Date;

  @Column({ type: 'varchar', length: 50, name: 'order_no', nullable: false, comment: '订单编号' })
  orderNo: string;

  @Column({ type: 'int', name: 'order_id', nullable: false, comment: '订单id' })
  orderId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'pay_price', nullable: true, default: 0.00, comment: '支付金额' })
  payPrice: number;

  @Column({ type: 'tinyint', nullable: true, default: 0, comment: '类型 0-支付 1-退还' })
  type: number; // 0 for payment, 1 for refund
}