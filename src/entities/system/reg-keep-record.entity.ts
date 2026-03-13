import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '/@/common/abstract.entity';

@Entity({ name: 'reg_keep_record', comment: '用户注册投注留存' })
export class RegKeepRecordEntity extends AbstractEntity {
  //推广商ID
  @Column({
    name: 'mer_id',
    type: 'bigint',
    unsigned: true,
    comment: '推广商ID',
  })
  merId: number;

  //渠道商ID
  @Column({
    name: 'channel_id',
    type: 'bigint',
    unsigned: true,
    comment: '渠道商ID',
  })
  channelId: number;

  //类型
  //1.投注 2.充值
  @Column({
    name: 'type',
    type: 'tinyint',
    unsigned: true,
    default: 1,
    comment: '类型1.投注 2.充值',
  })
  type: number;

  //userIds
  @Column({
    name: 'user_ids',
    type: 'simple-json',
    comment: '用户ID列表',
  })
  userIds: number[];

  //注册人数
  @Column({
    name: 'reg_count',
    type: 'int',
    unsigned: true,
    comment: '注册人数',
  })
  regCount: number;

  //充值人数
  @Column({
    name: 'recharge_count',
    type: 'int',
    unsigned: true,
    comment: '充值人数',
  })
  rechargeCount: number;

  //充值金额
  @Column({
    name: 'recharge_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    comment: '充值金额',
  })
  rechargeAmount: number;

  //提现人数
  @Column({
    name: 'withdraw_count',
    type: 'int',
    unsigned: true,
    comment: '提现人数',
  })
  withdrawCount: number;

  //提现金额
  @Column({
    name: 'withdraw_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    comment: '提现金额',
  })
  withdrawAmount: number;

  //投注人数
  @Column({
    name: 'bet_count',
    type: 'int',
    unsigned: true,
    comment: '投注人数',
  })
  betCount: number;

  //投注留存人数
  @Column({
    name: 'keep_recharge_count',
    type: 'simple-json',
    comment: '投注人数留存',
    nullable: true,
  })
  keepRechargeCount: {
    bet: {
      k2b: number; //2日留存
      k3b: number; //3日留存
      k4b: number; //4日留存
      k5b: number; //5日留存
      k6b: number; //5日留存
      k7b: number; //7日留存
      k30b: number; //30日留存
    };
    recharge: {
      k2r: number; //2日留存
      k3r: number; //3日留存
      k4r: number; //4日留存
      k5r: number; //5日留存
      k6r: number; //6日留存
      k7r: number; //7日留存
      k30r: number; //30日留存
    };
  };
}
