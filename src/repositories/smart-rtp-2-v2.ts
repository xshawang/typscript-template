import { BaseRTPController } from './base-smart-rtp';
import fastJson from 'fast-json-stringify';

export enum RTPPhase {
  NORMAL = 'normal',
  JACKPOT = 'jackpot',
  SLOW_DOWN = 'slow_down',
  RECOVER = 'recover',
  SUPPORT = 'support',
}

type JsonStringifyFunction = (input: any) => string;

export const stringifySmart2: JsonStringifyFunction = fastJson({
  title: 'SmartFor2RTPController',
  type: 'object',
  properties: {
    initialDeposit: { type: 'number' },
    totalReturn: { type: 'number' },
    totalBet: { type: 'number' },
    totalRounds: { type: 'number' },
    phase: { type: 'string' },
    consecutiveLoses: { type: 'number' },
    supportCount: { type: 'number' },
    supportThreshold: { type: 'number' },
    supportRoundsLeft: { type: 'number' },
    wagerTarget: { type: 'number' },
    rtpZone: { type: 'string' },
    jackpotCount: { type: 'number' },
    rtpfor8of2: { type: 'number' },
    lossHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          betAmount: { type: 'number' },
          winAmount: { type: 'number' },
          currentBalance: { type: 'number' },
        },
        required: ['betAmount', 'winAmount', 'currentBalance'],
      },
    },
    lossTrend: { type: 'string' },
    addedRtp: {
      type: 'array',
      items: { type: 'number' },
    },
    in2groupSubGroup: { type: 'string' },
    killFlag: { type: 'boolean' },
    lastOrderAmountNumber: { type: 'number' },
    logHeightHistory: { type: 'number' },
    recoverCount: { type: 'number' },
  },
  required: [
    'initialDeposit',
    'totalReturn',
    'totalBet',
    'totalRounds',
    'phase',
    'consecutiveLoses',
    'supportCount',
    'supportThreshold',
    'supportRoundsLeft',
    'wagerTarget',
    'rtpZone',
    'jackpotCount',
    'rtpfor8of2',
    'lossHistory',
    'lossTrend',
    'addedRtp',
    'in2groupSubGroup',
    'killFlag',
    'lastOrderAmountNumber',
    'logHeightHistory',
    'recoverCount',
  ],
});

export class SmartFor2RTPController extends BaseRTPController {
  // 玩家累计返奖金额（所有中奖金额的总和）
  private totalReturn: number;

  // 玩家累计投注金额（所有下注金额的总和）
  private totalBet: number;

  // 累计游戏回合数（统计游戏局数）
  private totalRounds: number;

  // 初始充值金额（用于判断低保触发 / 分区计算等）
  private initialDeposit: number;

  // 当前RTP阶段：NORMAL / JACKPOT / SLOW_DOWN / RECOVER / SUPPORT
  private phase: RTPPhase;

  // 连续未中奖计数器（用于触发小奖扶持）
  private consecutiveLoses: number;

  // 已触发的小奖扶持次数（每次触发后增加）
  private supportCount: number;

  // 当前小奖扶持触发门槛（初始为5，每次扶持后+2，最高限制可控）
  private supportThreshold: number;

  // 当前小奖扶持剩余轮数（例如设置为2轮小扶持，之后回归正常）
  private supportRoundsLeft: number;

  // 当前打码目标值 = initialDeposit × 倍数（默认8）
  // 达到该值即视为完成生命周期，可根据比例判断 RTP 区段
  private wagerTarget: number;
  // 当前RTP波动区间：
  // - active  => 平稳波动（打码低于1/3）
  // - volatile => 大幅震荡（1/3~2/3）
  // - crash   => 断崖压制（高打码阶段）
  private rtpZone: 'startHappy' | 'active' | 'volatile' | 'crash';

  private jackpotCount: number; // 大奖次数

  private rtpfor8of2: number;

  private in2groupSubGroup: 'top' | 'middle' | 'lower'; // 2组内的子组 1,2,3

  private lossHistory: {
    betAmount: number;
    winAmount: number;
    currentBalance: number;
  }[];

  private addedRtp: number[]; // 额外的RTP

  // 亏损趋势，表示亏损是上升还是下降
  private lossTrend: 'up' | 'down' | 'stable' | 'sharpUp' | 'sharpDown';

  private killFlag: boolean; // 是否被杀死

  private lastOrderAmountNumber: number;

  private logHeightHistory: number;

  private recoverCount: number; // 触发回升的次数

  private recoverLeft: number; // 回升剩余轮数

  constructor(
    initialDeposit: number,
    phase?: RTPPhase,
    addedRtp?: number[],
    jackpotCount?: number,
    totalReturn?: number,
    totalBet?: number,
    in2groupSubGroup?: any,
    wagerTarget?: number,
    killFlag?: boolean,
    lastOrderAmountNumber?: number,
    logHeightHistory?: number,
    recoverCount?: number,
    recoverLeft?: number,
  ) {
    super();
    const in2groupSubGroupRandom = Math.random();
    let i2r: 'top' | 'middle' | 'lower' = 'lower';
    if (in2groupSubGroupRandom < 0.05) {
      i2r = 'top';
    } else if (in2groupSubGroupRandom < 0.15) {
      i2r = 'middle';
    } else {
      i2r = 'lower';
    }
    this.lastOrderAmountNumber = lastOrderAmountNumber || 0;
    this.in2groupSubGroup = in2groupSubGroup || i2r; // 随机选择2组内的子组
    this.initialDeposit = initialDeposit;
    this.totalReturn = totalReturn || 0;
    this.totalBet = totalBet || 0;
    this.totalRounds = 0;
    this.phase = phase || RTPPhase.NORMAL;
    this.consecutiveLoses = 0;
    this.supportCount = 0;
    this.supportThreshold = 3;
    this.supportRoundsLeft = 0;
    this.wagerTarget =
      wagerTarget || initialDeposit * Math.floor(Math.random() * 2 + 3); // 随机选择3~4倍
    this.rtpZone = 'active';
    this.jackpotCount = jackpotCount || 0;
    this.rtpfor8of2 = 2;
    this.lossHistory = [];
    this.lossTrend = 'stable'; // 初始为稳定
    this.addedRtp = addedRtp || [
      ...Array(Math.floor(Math.random() * 5)).fill(37),
      ...Array(Math.floor(Math.random() * 5)).fill(33),
    ];
    this.killFlag = killFlag || false; // 是否被杀死
    this.logHeightHistory = logHeightHistory || 0; // 记录历史高度
    this.recoverCount = recoverCount || 0; // 触发回升的次数
    this.recoverLeft = recoverLeft || 0; // 回升剩余轮数
  }

  static fromJSON(json: any): BaseRTPController {
    const inst = new SmartFor2RTPController(json.initialDeposit);
    inst.totalReturn = json.totalReturn || 0;
    inst.totalBet = json.totalBet || 0;
    inst.totalRounds = json.totalRounds || 0;
    inst.phase = json.phase || RTPPhase.NORMAL;
    inst.consecutiveLoses = json.consecutiveLoses || 0;
    inst.supportCount = json.supportCount || 0;
    inst.supportThreshold = json.supportThreshold || 5;
    inst.supportRoundsLeft = json.supportRoundsLeft || 0;
    inst.wagerTarget = json.wagerTarget || inst.initialDeposit * 8;
    inst.rtpZone = json.rtpZone || 'active';
    inst.jackpotCount = json.jackpotCount || 0;
    inst.rtpfor8of2 = json.rtpfor8of2 || 8;
    inst.lossHistory = json.lossHistory || [];
    inst.lossTrend = json.lossTrend || 'stable'; // 初始为稳定
    inst.addedRtp = json.addedRtp || [];
    inst.in2groupSubGroup = json.in2groupSubGroup || 'lower'; // 随机选择2组内的子组
    inst.killFlag = json.killFlag || false; // 是否被杀死
    inst.lastOrderAmountNumber = json.lastOrderAmountNumber || 0; // 上次的投注金额
    inst.logHeightHistory = json.logHeightHistory || 0; // 记录历史高度
    inst.recoverCount = json.recoverCount || 0; // 触发回升的次数
    inst.recoverLeft = json.recoverLeft || 0; // 回升剩余轮数
    return inst;
  }

  toJSON() {
    return {
      initialDeposit: this.initialDeposit,
      totalReturn: this.totalReturn,
      totalBet: this.totalBet,
      totalRounds: this.totalRounds,
      phase: this.phase,
      consecutiveLoses: this.consecutiveLoses,
      supportCount: this.supportCount,
      supportThreshold: this.supportThreshold,
      supportRoundsLeft: this.supportRoundsLeft,
      wagerTarget: this.wagerTarget,
      rtpZone: this.rtpZone,
      jackpotCount: this.jackpotCount,
      rtpfor8of2: this.rtpfor8of2,
      lossHistory: this.lossHistory,
      lossTrend: this.lossTrend,
      addedRtp: this.addedRtp,
      in2groupSubGroup: this.in2groupSubGroup,
      killFlag: this.killFlag,
      lastOrderAmountNumber: this.lastOrderAmountNumber,
      logHeightHistory: this.logHeightHistory,
      recoverCount: this.recoverCount,
      recoverLeft: this.recoverLeft,
    };
  }

  async withdrawSub(): Promise<any> {
    const newWagerTarget = this.wagerTarget * 0.3;
    this.wagerTarget = newWagerTarget;
    this.jackpotCount = 10;
  }

  /**
   * 核心算法
   * @param betAmount 投注金额
   * @param winAmount 翻浆金额
   * @param currentBalance 当前余额
   * @returns 无
   */
  reportLastResult(
    betAmount: number,
    winAmount: number,
    currentBalance: number,
    justMathBetWin = false,
  ): void {
    this.lossHistory.push({
      betAmount,
      winAmount,
      currentBalance,
    });

    this.totalBet += betAmount;
    this.totalReturn += winAmount;
    this.totalRounds += 1;
    const winRadio = (winAmount - betAmount) / this.initialDeposit;
    const startHappyCantWins = [0.07, 0.08, 0.09, 0.1];
    const balanceThreshold =
      this.initialDeposit *
      { top: 3.85, middle: 2.68, lower: 2.3 }[this.in2groupSubGroup]; // 余额大幅变化的阈值 150%（根据需要调整）

    // 只保留最近 10 次的亏损记录，避免数组过长
    if (this.lossHistory.length > 10) {
      this.lossHistory.shift();
    }

    // --------------------------必须前置判断的逻辑--------------------------

    if (justMathBetWin) {
      return;
    }

    const jboolean = this.mathJackpot(currentBalance);
    if (jboolean) {
      return;
    }

    if (this.addedRtp.length > 0) {
      return;
    }

    // 已经开启慢慢下降阶段了 就不需要判断了，再下一次充值之前都不会计算
    if (
      currentBalance > balanceThreshold ||
      this.totalBet >= this.wagerTarget ||
      this.phase === RTPPhase.SLOW_DOWN ||
      this.killFlag
    ) {
      this.lossHistory = [];
      this.phase = RTPPhase.SLOW_DOWN;
      return;
    }
    // --------------------------必须前置判断的逻辑 end--------------------------

    // 计算亏损趋势
    this.calculateLossTrend();

    // 计算当前盈利
    if (winAmount <= 0) {
      this.consecutiveLoses += 1;
    } else {
      //或者盈利小于投注的50%
      if (winAmount < betAmount * 0.5) {
        this.consecutiveLoses += 1;
      } else {
        this.consecutiveLoses = 0;
      }
    }

    // 如果进入了连续亏损阶段 并且进入了小奖扶持阶段
    if (this.phase === RTPPhase.SUPPORT) {
      this.supportRoundsLeft -= 1;
      if (this.supportRoundsLeft <= 0) {
        this.phase = RTPPhase.NORMAL;
        this.supportCount += 1;
        this.supportThreshold += 1;
        if (
          this.supportThreshold > [9, 13, 16, 20][Math.floor(Math.random() * 4)]
        ) {
          //回归正常
          this.supportThreshold = 1;
        }
      }
      return;
    }

    //判断是否需要进入小奖扶持阶段 连续未中奖次数大于supportThreshold
    if (this.consecutiveLoses >= this.supportThreshold) {
      this.phase = RTPPhase.SUPPORT;
      this.supportRoundsLeft = Math.floor(Math.random() * 2 + 1); // 随机1-3轮
      this.supportCount += 1;
      this.consecutiveLoses = 0;
      return;
    }

    // 如果进来了大奖阶段 就回到正常阶段
    if (this.phase === RTPPhase.JACKPOT) {
      this.phase = RTPPhase.NORMAL;
      return;
    }

    const wagerRatio = this.totalBet / this.wagerTarget;
    if (wagerRatio < 0.065) {
      if (
        winRadio >
        startHappyCantWins[
          Math.floor(Math.random() * startHappyCantWins.length)
        ]
      ) {
        this.rtpZone = 'active';
      } else {
        this.rtpZone = 'startHappy';
      }
    } else if (wagerRatio < 0.15) {
      this.rtpZone = 'active';
    } else if (wagerRatio < 0.35) {
      this.rtpZone = 'volatile';
    } else {
      this.rtpZone = 'crash';
    }
  }

  addRtpFn(addRtp: number[]) {
    this.addedRtp = addRtp;
  }

  private mathJackpot(currentBalance: number): boolean {
    // 当前余额比例 / 初始充值金额 = 当前余额剩余比例
    const ratio = currentBalance / this.initialDeposit;
    const radioDown = [0.13, 0.14, 0.15, 0.16, 0.3, 0.3, 0.4, 0.5];
    if (
      ratio <= this.randomPick(radioDown) // 余额小于5%~12%
    ) {
      // 如果是0次触发JACKPOT 就是 100% 如果第二次就减半的几率 第三次就是 25% 每次都减半的几率
      const jackpotChance = Math.pow(0.5, this.jackpotCount);
      if (Math.random() < jackpotChance) {
        this.jackpotCount += 10;
        this.phase = RTPPhase.JACKPOT;
        return true;
      }
    }
    return false;
  }

  private calculateLossTrend(): void {
    // 如果历史记录不足两次，无法计算趋势
    if (this.lossHistory.length < 2) {
      this.lossTrend = 'stable';
      return;
    }

    // 获取最近几轮的投注数据，假设我们看过去的 5 次投注（根据实际情况调整）
    const recentBets = this.lossHistory.slice(-5);

    // 计算最近 5 次的总投注金额和总盈亏
    const totalBetAmount = recentBets.reduce(
      (sum, bet) => sum + bet.betAmount,
      0,
    );
    const totalWinAmount = recentBets.reduce(
      (sum, bet) => sum + bet.winAmount,
      0,
    );
    const totalLossAmount = totalWinAmount - totalBetAmount; // 计算总盈亏

    // 根据余额的变化来计算亏损的趋势
    const balanceChange =
      recentBets[recentBets.length - 1].currentBalance -
      recentBets[0].currentBalance;

    // 设定大幅变化的阈值（可以根据实际情况调整）
    const lossThreshold = 0.2; // 亏损大幅变化的阈值 20%（根据需要调整）
    const balanceThreshold = 100; // 余额大幅变化的阈值 100（根据需要调整）

    // 根据盈亏和余额变化来判断趋势
    if (totalLossAmount < 0 && balanceChange < 0) {
      // 亏损增加且余额减少
      if (
        Math.abs(totalLossAmount) / totalBetAmount > lossThreshold ||
        Math.abs(balanceChange) > balanceThreshold
      ) {
        this.lossTrend = 'sharpDown'; // 大幅亏损
      } else {
        this.lossTrend = 'down'; // 亏损
      }
    } else if (totalLossAmount > 0 && balanceChange > 0) {
      // 盈利增加且余额增加
      if (
        Math.abs(totalLossAmount) / totalBetAmount < -lossThreshold ||
        Math.abs(balanceChange) > balanceThreshold
      ) {
        this.lossTrend = 'sharpUp'; // 大幅盈利
      } else {
        this.lossTrend = 'up'; // 盈利
      }
    } else {
      this.lossTrend = 'stable'; // 盈亏平衡或者无明显变化
    }
  }

  getCurrentRTP(): number {
    return this.totalBet === 0 ? 0 : this.totalReturn / this.totalBet;
  }

  /**
   * 37 等于原本的-1
   * @returns
   */
  decideNextSlot(): number {
    // 如果NORMAL 说明不走这里
    // 优先判断特殊 phase，直接命中后返回

    if (this.addedRtp.length > 0) {
      // this.addedRtp 随机取出下标后删除这个
      const randomIndex = Math.floor(Math.random() * this.addedRtp.length);
      const rtp = this.addedRtp[randomIndex];
      this.addedRtp.splice(randomIndex, 1);
      return rtp;
    }

    if (this.phase === RTPPhase.JACKPOT) {
      this.addedRtp.push(38, 31);
      if (this.lossHistory.length >= 3) {
        const recentBets = this.lossHistory.slice(this.lossHistory.length);
        // 计算最近 5 次的总投注金额和总盈亏
        const totalBetAmount = recentBets.reduce(
          (sum, bet) => sum + bet.betAmount,
          0,
        );
        const average20Bet = totalBetAmount / this.lossHistory.length;

        return average20Bet >= this.initialDeposit * 0.051 ? 34 : 35;
      }
      return this.randomPick([35, 36]);
    }

    if (this.phase === RTPPhase.SUPPORT) {
      //连续不中扶持
      const rlist = {
        top: [34, 32, 32, 32, 35, 35],
        middle: [34, 34, 32, 32, 35],
        lower: [34, 34, 34, 32, 32, 35],
      };
      return this.randomPick(rlist[this.in2groupSubGroup]);
    }

    if (this.phase === RTPPhase.SLOW_DOWN) {
      return this.randomPick([
        ...Array(45).fill(37),
        ...Array(7).fill(33),
        ...Array(1).fill(38),
        ...Array(2).fill(34),
        32,
      ]);
    }

    if (this.phase === RTPPhase.RECOVER) {
      return this.randomPick([
        ...Array(5).fill(33),
        ...Array(2).fill(37),
        ...Array(1).fill(38),
        ...Array(1).fill(34),
      ]);
    }

    // 这里就是NORMAL 阶段了
    switch (this.rtpZone) {
      case 'startHappy':
        return this.randomPick([
          ...Array(10).fill(37),
          ...Array(1).fill(33),
          38,
          32,
        ]);
      case 'active':
        return this.randomPick([
          ...Array(20).fill(37),
          ...Array(2).fill(33),
          ...Array(1).fill(38),
          34,
          32,
        ]);
      case 'volatile':
        return this.randomPick([
          ...Array(39).fill(37),
          ...Array(2).fill(33),
          ...Array(2).fill(38),
          34,
          31,
        ]);
      case 'crash':
        return this.randomPick([
          ...Array(43).fill(37),
          ...Array(3).fill(33),
          ...Array(1).fill(38),
          ...Array(2).fill(34),
        ]);
    }
  }

  private randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  status() {
    return {
      phase: this.phase,
      rtp: this.getCurrentRTP().toFixed(3),
      totalReturn: this.totalReturn.toFixed(2),
      totalBet: this.totalBet.toFixed(2),
      totalRounds: this.totalRounds,
      supportCount: this.supportCount,
      supportThreshold: this.supportThreshold,
      supportRoundsLeft: this.supportRoundsLeft,
      consecutiveLoses: this.consecutiveLoses,
      rtpZone: this.rtpZone,
      rtpfor8of2: this.rtpfor8of2,
      lossTrend: this.lossTrend,
      initialDeposit: this.initialDeposit,
      wagerTarget: this.wagerTarget,
      jackpotCount: this.jackpotCount,
      in2groupSubGroup: this.in2groupSubGroup,
    };
  }
}
