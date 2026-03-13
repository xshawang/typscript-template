import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '/@/common/abstract.entity';

export type Content = {
  content: string;
  lang: string;
};

@Entity({ name: 'notice', comment: '通知记录' })
export class NoticeEntity extends AbstractEntity {
  //用户id
  @Column({
    name: 'user_id',
    type: 'bigint',
    unsigned: true,
    comment: '用户id',
  })
  userId: number;

  // 内容
  @Column({
    name: 'content',
    type: 'simple-json',
    comment: '内容',
  })
  content: Content[];

  // 是否已读
  @Column({
    name: 'is_read',
    type: 'tinyint',
    unsigned: true,
    comment: '是否已读 0:未读 1:已读',
    default: 0,
  })
  isRead: number;
}
