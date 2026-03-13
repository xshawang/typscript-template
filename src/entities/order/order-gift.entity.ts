import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_gift')
export class OrderGiftEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'order_no', type: 'varchar', length: 50, comment: '订单编号' })
  @ApiProperty({ description: '订单编号' })
  orderNo: string;

  @Column({ name: 'gift_id', type: 'int', comment: '物品id' })
  @ApiProperty({ description: '物品id' })
  giftId: number;

  @Column({ name: 'gift_name', type: 'varchar', length: 100, comment: '物品名称' })
  @ApiProperty({ description: '物品名称' })
  giftName: string;

  @Column({ name: 'gift_num', type: 'int', comment: '物品数量' })
  @ApiProperty({ description: '物品数量' })
  giftNum: number;

  @Column({ name: 'gift_price', type: 'decimal', precision: 10, scale: 2, comment: '物品价格' })
  @ApiProperty({ description: '物品价格' })
  giftPrice: number;

  @CreateDateColumn({ name: 'create_date', type: 'datetime', comment: '创建时间' })
  @ApiProperty({ description: '创建时间' })
  createDate: Date;

  @Column({ name: 'return_date', type: 'datetime', nullable: true, comment: '退还时间' })
  @ApiProperty({ description: '退还时间', required: false })
  returnDate?: Date;

  @Column({ name: 'return_num', type: 'int', default: 0, comment: '退还数量' })
  @ApiProperty({ description: '退还数量', default: 0 })
  returnNum: number;
}