import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('channels')
export class Channel extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '景区编码' })
  channel: string;

  @Column({ type: 'varchar', length: 100, nullable: false, comment: '景区名称' })
  channelName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '景区位置' })
  city: string;

  @Column({ type: 'int', nullable: true, default: 0, comment: '几星' })
  star: number;

  @Column({ type: 'text', nullable: true, comment: '说明' })
  remark: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '联系人电话' })
  phone: string;
}