import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机' })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像' })
  img: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '昵称',name: 'nick_name' })
  nickName: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true, comment: '微信open_id' ,name: 'open_id' })
  openId: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true, comment: '微信union_id',name: 'union_id' })
  unionId: string;

  @Column({ type: 'datetime', name: 'create_date', nullable: true, comment: '注册时间' })
  createDate: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: '注册ip' })
  ip: string;

  @Column({ type: 'int',  nullable: true, comment: '景区id' })
  channel: number;

  @Column({ type: 'int',  nullable: true, comment: '营业站点' })
  station: number;
}