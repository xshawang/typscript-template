import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({ name: 'phone', type: 'varchar', nullable: true, comment: '手机' })
  @ApiProperty({ description: '手机', required: false })
  phone?: string;

  @Column({ name: 'img', type: 'varchar', nullable: true, comment: '头像' })
  @ApiProperty({ description: '头像', required: false })
  img?: string;

  @Column({ name: 'nick_name', type: 'varchar', nullable: true, comment: '昵称' })
  @ApiProperty({ description: '昵称', required: false })
  nickName?: string;

  @Column({ name: 'open_id', type: 'varchar', unique: true, nullable: true, comment: '微信open_id' })
  @ApiProperty({ description: '微信open_id', required: false })
  openId?: string;

  @Column({ name: 'union_id', type: 'varchar', nullable: true, comment: '微信union_id' })
  @ApiProperty({ description: '微信union_id', required: false })
  unionId?: string;

  @CreateDateColumn({ name: 'create_date', type: 'datetime', comment: '注册时间' })
  @ApiProperty({ description: '注册时间' })
  createDate: Date;

  @Column({ name: 'ip', type: 'varchar', nullable: true, comment: '注册ip' })
  @ApiProperty({ description: '注册ip', required: false })
  ip?: string;

  @Column({ name: 'channel', type: 'varchar', nullable: true, comment: '来源' })
  @ApiProperty({ description: '来源', required: false })
  channel?: string;
}