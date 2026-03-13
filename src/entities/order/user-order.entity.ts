import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_order')
export class UserOrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'order_no', type: 'varchar', length: 50, unique: true, comment: '订单编号' })
  @ApiProperty({ description: '订单编号' })
  orderNo: string;

  @Column({ name: 'order_price', type: 'decimal', precision: 10, scale: 2, comment: '订单价格' })
  @ApiProperty({ description: '订单价格' })
  orderPrice: number;

  @Column({ name: 'order_num', type: 'int', default: 1, comment: '数量' })
  @ApiProperty({ description: '数量', default: 1 })
  orderNum: number;

  @Column({ name: 'user_id', type: 'bigint', comment: '会员id' })
  @ApiProperty({ description: '会员id' })
  userId: number;

  @CreateDateColumn({ name: 'create_date', type: 'datetime', comment: '生成订单时间' })
  @ApiProperty({ description: '生成订单时间' })
  createDate: Date;

  @Column({ name: 'pay_date', type: 'datetime', nullable: true, comment: '支付时间' })
  @ApiProperty({ description: '支付时间', required: false })
  payDate?: Date;

  @Column({ name: 'callback_date', type: 'datetime', nullable: true, comment: '回调确认成功时间' })
  @ApiProperty({ description: '回调确认成功时间', required: false })
  callbackDate?: Date;

  @Column({ name: 'pay_channel', type: 'varchar', length: 50, nullable: true, comment: '支付渠道' })
  @ApiProperty({ description: '支付渠道', required: false })
  payChannel?: string;

  @Column({ name: 'channel_id', type: 'int', comment: '景区' })
  @ApiProperty({ description: '景区' })
  channelId: number;

  @Column({ name: 'return_date', type: 'datetime', nullable: true, comment: '申请退还时间' })
  @ApiProperty({ description: '申请退还时间', required: false })
  returnDate?: Date;

  @Column({ name: 'return_flag', type: 'int', default: 0, comment: '退还物品数量' })
  @ApiProperty({ description: '退还物品数量', default: 0 })
  returnFlag: number;

  @Column({ name: 'return_price', type: 'decimal', precision: 10, scale: 2, default: 0.00, comment: '退还金额' })
  @ApiProperty({ description: '退还金额', default: 0.00 })
  returnPrice: number;

  @Column({ name: 'broke_price', type: 'decimal', precision: 10, scale: 2, default: 0.00, comment: '损耗金额' })
  @ApiProperty({ description: '损耗金额', default: 0.00 })
  brokePrice: number;

  @Column({ name: 'return_sucess_date', type: 'datetime', nullable: true, comment: '退还成功时间' })
  @ApiProperty({ description: '退还成功时间', required: false })
  returnSuccessDate?: Date;

  @Column({ name: 'return_sucess_flag', type: 'tinyint', default: 0, comment: '退还成功标记 1 成功' })
  @ApiProperty({ description: '退还成功标记 1 成功', default: 0 })
  returnSuccessFlag: number;
}