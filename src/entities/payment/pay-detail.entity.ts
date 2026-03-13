import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('pay_detail')
export class PayDetailEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'pay_name', type: 'varchar', length: 100, comment: '支付渠道' })
  @ApiProperty({ description: '支付渠道' })
  payName: string;

  @Column({ name: 'pay_param', type: 'text', nullable: true, comment: '请求参数' })
  @ApiProperty({ description: '请求参数', required: false })
  payParam?: string;

  @CreateDateColumn({ name: 'request_date', type: 'datetime', comment: '请求时间' })
  @ApiProperty({ description: '请求时间' })
  requestDate: Date;

  @Column({ name: 'response_data', type: 'text', nullable: true, comment: '返回' })
  @ApiProperty({ description: '返回', required: false })
  responseData?: string;

  @Column({ name: 'req_num', type: 'int', default: 1, comment: '第几次' })
  @ApiProperty({ description: '第几次', default: 1 })
  reqNum: number;

  @Column({ name: 'sucess_flag', type: 'tinyint', default: 0, comment: '成功与否标志 1 成功 0初始化' })
  @ApiProperty({ description: '成功与否标志 1 成功 0初始化', default: 0 })
  successFlag: number;

  @Column({ name: 'callback_date', type: 'datetime', nullable: true, comment: '回调时间' })
  @ApiProperty({ description: '回调时间', required: false })
  callbackDate?: Date;

  @Column({ name: 'order_no', type: 'varchar', length: 50, comment: '订单编号' })
  @ApiProperty({ description: '订单编号' })
  orderNo: string;

  @Column({ name: 'order_id', type: 'bigint', comment: '订单id' })
  @ApiProperty({ description: '订单id' })
  orderId: number;

  @Column({ name: 'pay_price', type: 'decimal', precision: 10, scale: 2, comment: '支付金额' })
  @ApiProperty({ description: '支付金额' })
  payPrice: number;

  @Column({ name: 'type', type: 'tinyint', default: 0, comment: '0 支付 1 退还' })
  @ApiProperty({ description: '0 支付 1 退还', default: 0 })
  type: number;
}