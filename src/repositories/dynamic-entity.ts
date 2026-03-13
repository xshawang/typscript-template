import { EntitySchema } from 'typeorm';

export function createEntityBetRecordSchema(table: string): EntitySchema {
  return new EntitySchema({
    name: table,
    tableName: table,
    columns: {
      id: { type: Number, primary: true, generated: true },
      userId: { type: Number, name: 'user_id' },
      gameId: { type: Number, name: 'game_id' },
      channelId: { type: Number, name: 'channel_id' },
      merId: { type: Number, name: 'mer_id' },
      bet: { type: String },
      totalReward: { type: String, name: 'total_reward' },
      afterBalance: { type: String, name: 'after_balance' },
      rtp: { type: Number, name: 'rtp', nullable: true },
      createTime: {
        type: Date,
        name: 'create_time',
        default: () => 'CURRENT_TIMESTAMP',
      },
    },
  });
}

export function createEntityFundsRecordSchema(table: string): EntitySchema {
  return new EntitySchema({
    name: table,
    tableName: table,
    columns: {
      id: { type: Number, primary: true, generated: true },
      userId: { type: Number, name: 'user_id' },
      accountId: { type: Number, name: 'account_id' },
      channelId: { type: Number, name: 'channel_id' },
      merId: { type: Number, name: 'mer_id' },
      balanceBefore: { type: String, name: 'balance_before' },
      balanceAfter: { type: String, name: 'balance_after' },
      amount: { type: String, name: 'amount' },
      atype: { type: Number, name: 'atype' },
      remark: { type: String, name: 'remark' },
      createTime: {
        type: Date,
        name: 'create_time',
        default: () => 'CURRENT_TIMESTAMP',
      },
    },
  });
}
