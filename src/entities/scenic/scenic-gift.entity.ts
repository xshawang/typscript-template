import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('scenic_gift')
export class ScenicGiftEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'gift_name', type: 'varchar', length: 100, comment: '名称' })
  @ApiProperty({ description: '名称' })
  giftName: string;

  @Column({ name: 'gift_price', type: 'decimal', precision: 10, scale: 2, comment: '价格' })
  @ApiProperty({ description: '价格' })
  giftPrice: number;

  @Column({ name: 'gift_num', type: 'int', default: 0, comment: '数量' })
  @ApiProperty({ description: '数量', default: 0 })
  giftNum: number;

  @Column({ name: 'channel_id', type: 'bigint', comment: '景区' })
  @ApiProperty({ description: '景区ID' })
  channelId: number;

  @Column({ name: 'vstatus', type: 'tinyint', default: 0, comment: '销售状态 0销售 1不销售' })
  @ApiProperty({ description: '销售状态 0销售 1不销售', default: 0 })
  vstatus: number;

  @CreateDateColumn({ name: 'create_time', type: 'timestamp', comment: '创建时间' })
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', type: 'timestamp', comment: '更新时间' })
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;
}