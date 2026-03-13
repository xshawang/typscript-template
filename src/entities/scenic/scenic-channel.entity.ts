import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('scenic_channel')
export class ScenicChannelEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'channel', type: 'varchar', length: 50, unique: true, comment: '景区编码' })
  @ApiProperty({ description: '景区编码' })
  channel: string;

  @Column({ name: 'channel_name', type: 'varchar', length: 100, comment: '景区名称' })
  @ApiProperty({ description: '景区名称' })
  channelName: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true, comment: '景区位置' })
  @ApiProperty({ description: '景区位置', required: false })
  city?: string;

  @Column({ name: 'star', type: 'int', default: 0, comment: '几星' })
  @ApiProperty({ description: '几星', default: 0 })
  star: number;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true, comment: '说明' })
  @ApiProperty({ description: '说明', required: false })
  remark?: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true, comment: '联系人电话' })
  @ApiProperty({ description: '联系人电话', required: false })
  phone?: string;
}