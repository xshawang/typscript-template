import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('admin_member')
export class AdminMemberEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ description: 'ID' })
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true, comment: '用户名' })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 100, comment: '密码(MD5加密)' })
  @ApiProperty({ description: '密码(MD5加密)' })
  password: string;

  @Column({ name: 'device_id', type: 'varchar', length: 50, nullable: true, comment: '设备ID' })
  @ApiProperty({ description: '设备ID', required: false })
  deviceId?: string;

  @Column({ name: 'role_type', type: 'tinyint', default: 1, comment: '角色类型 1操作员 2管理员' })
  @ApiProperty({ description: '角色类型 1操作员 2管理员', default: 1 })
  roleType: number;

  @CreateDateColumn({ name: 'create_time', type: 'timestamp', comment: '创建时间' })
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', type: 'timestamp', comment: '更新时间' })
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;
}