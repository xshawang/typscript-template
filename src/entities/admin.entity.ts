import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('admins')
export class Admin extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '用户名' })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '密码(MD5加密)' })
  password: string;

  @Column({ type: 'varchar', name: 'device_id', length: 50, unique: true, nullable: true, comment: '设备ID' })
  deviceId: string;

  @Column({ type: 'tinyint', nullable: true, default: 1, comment: '角色 1-操作员 2-管理员' })
  role: number; // 1 for operator, 2 for admin
}