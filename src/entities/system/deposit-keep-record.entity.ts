import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '/@/common/abstract.entity';

@Entity({ name: 'deposit_keep_record', comment: '首充注册投注留存' })
export class DepositKeepRecordEntity extends AbstractEntity {
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

  @Column({
    name: 'user_ids',
    type: 'simple-json',
    comment: '用户ID列表',
  })
  userIds: number[];

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

  //首充人数
  @Column({
    name: 'deposit_count',
    type: 'int',
    unsigned: true,
    comment: '首充人数',
  })
  depositCount: number;

  //首充金额
  @Column({
    name: 'first_deposit_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    comment: '首充金额',
  })
  firstDepositAmount: number;

  //充值金额
  @Column({
    name: 'deposit_amount',
    type: 'decimal',
    precision: 18,
    scale: 2,
    unsigned: true,
    comment: '充值金额',
  })
  depositAmount: number;

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

  //当日复充人数(2次充值以上)
  @Column({
    name: 'recharge_count',
    type: 'int',
    unsigned: true,
    comment: '当日复充人数',
  })
  rechargeCount: number;

  //投注留存人数
  @Column({
    name: 'keep_bet_count',
    type: 'simple-json',
    comment: '投注人数留存',
    nullable: true,
  })
  keepBetCount: {
    k2r: number; //2日留存
    k3r: number; //3日留存
    k4r: number; //4日留存
    k5r: number; //5日留存
    k6r: number; //6日留存
    k7r: number; //7日留存
    k15r: number; //15日留存
    k20r: number; //20日留存
    k25r: number; //25日留存
    k30r: number; //30日留存
  };
}
