import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity('gifts')
export class Gift extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, comment: '名称',name: 'gift_name' })
  giftName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, comment: '价格',name: 'gift_price' })
  giftPrice: number;

  @Column({ type: 'int', nullable: true, default: 0, comment: '数量',name: 'gift_num' })
  giftNum: number;

  @Column({ type: 'bigint', name: 'channel_id', nullable: false, comment: '景区ID' })
  channelId: number;

  @Column({ type: 'tinyint', default: 0, comment: '销售状态 0-销售 1-不销售' })
  vstatus: number;

  @Column({ type: 'tinyint', name: 'gift_type', default: 0, comment: '物料类型，0 默认物料单件，1 对外销售的包装件' })
  giftType: number; 
  @Column({ type: 'varchar', length: 500, name: 'gift_desc', nullable: true, comment: '包装件，具体包含物料json如[{id:1,name:"登山杖",num:1},{id:2,name:"遮阳伞",num:1}]' })
  giftDesc: string; 
  @Column({ type: 'varchar', length: 255, name: 'gift_icon', nullable: true, comment: '包装件图标' })
  giftIcon: string; 
  @Column({ type: 'varchar', length: 255, name: 'remark', nullable: true, comment: '备注' })
  remark: string; 
}