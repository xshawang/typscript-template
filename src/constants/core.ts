/**
 * 树根节点ID统一值
 */
export const TREE_ROOT_NODE_ID = 0;

/**
 * 系统内置配置字典项标识
 */
export const CONFIG_SYS_CH_PWD = 'sys_ch_pwd';
export const CONFIG_SYS_USERINFO = 'sys_userinfo';

export const FundQueueAtype = {
  //1.充值 2.提现 3.投注 4.投注返奖 5.活动奖励 6.其他
  deposit: 1,
  withdraw: 2,
  transfer: 3,
  winBack: 4,
  activityReward: 5,
  other: 6,
};

export const getBetsByNum = (num: number): number[] => {
  const vis = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 50]);

  if (vis.has(num)) return getBetsByNumList(num);

  const divisors = [5, 2];

  for (let i = 0; i < 10; i++) {
    // 最多尝试10次防止死循环
    for (const d of divisors) {
      num = num / d;
      if (vis.has(num)) return getBetsByNumList(num);
    }
  }

  return getBetsByNumList(1);
};

export const getBetsByNumList = (num: number): number[] => {
  return Math.random() < 0.5 ? bets01[`${num}b`] : bets02[`${num}b`];
};

/**
 * 小波浪
 */
export const bets01: Record<string, number[]> = {
  '1b': [33],
  '2b': [33],
  '3b': [33, 33],
  '4b': [33, 37, 37, 37, 38, 33],
  '5b': [37, 38, 37, 33],
  '6b': [37, 38, 37, 37, 33, 33, 33],
  '7b': [37, 38, 33, 33, 37, 37, 37, 33, 37, 38],
  '8b': [38, 33, 37, 37, 37, 33, 37, 38, 33, 37],
  '9b': [37, 37, 38, 33, 37, 37, 37, 38, 33, 33],
  '10b': [34, 37, 37, 38, 33, 33],
  '15b': [38, 38, 37, 38, 33, 37, 37, 33],
  '20b': [38, 37, 33, 37, 37, 33, 38, 38],
  '50b': [32, 31, 37, 37, 37, 38, 35],
};

/**
 * 大波浪
 */
export const bets02: Record<string, number[]> = {
  '1b': [33],
  '2b': [33],
  '3b': [33, 33],
  '4b': [33, 37, 37, 37, 38, 33],
  '5b': [37, 38, 37, 33],
  '6b': [38, 37, 37, 37, 37, 37, 37, 38, 38],
  '7b': [31, 37, 37, 37, 37, 37, 37, 33, 38, 33],
  '8b': [37, 37, 37, 34, 38, 38],
  '9b': [37, 37, 37, 34, 38, 38, 33, 33],
  '10b': [37, 37, 37, 34, 34],
  '15b': [37, 34, 37, 37, 37, 33, 37, 37, 37, 34],
  '20b': [34, 37, 37, 37, 37, 37, 34, 37, 38, 38, 37, 33],
  '50b': [35, 32],
};
