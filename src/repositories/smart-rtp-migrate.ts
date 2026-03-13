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

export const stringifySmartMigrate: JsonStringifyFunction = fastJson({
  title: 'SmartForMigrateRTPController',
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
    migrate: { type: 'number' },
    recoverLeft: { type: 'number' },
    recoverCount: { type: 'number' },
    lossTrend: { type: 'string' },
    killFlag: { type: 'boolean' },
    lastOrderAmountNumber: { type: 'number' },
    logHeightHistory: { type: 'number' },
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
    'migrate',
    'recoverLeft',
    'recoverCount',
    'lossTrend',
    'killFlag',
    'lastOrderAmountNumber',
    'logHeightHistory',
  ],
});

export class SmartForMigrateRTPController extends BaseRTPController {
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

  private migrate: number; //1

  //回升剩余轮数
  private recoverLeft: number;

  //触发回升的次数
  private recoverCount: number;

  // 亏损趋势，表示亏损是上升还是下降
  private lossTrend: 'up' | 'down' | 'stable' | 'sharpUp' | 'sharpDown';

  private killFlag: boolean; // 是否被杀死

  private lastOrderAmountNumber: number; // 应该回本的最高金额

  private logHeightHistory: number;

  constructor(
    initialDeposit: number,
    phase?: RTPPhase,
    addedRtp?: number[],
    jackpotCount?: number,
    totalReturn?: number,
    totalBet?: number,
    killFlag?: boolean,
    lastOrderAmountNumber?: number,
    logHeightHistory?: number,
    recoverCount?: number,
    recoverLeft?: number,
  ) {
    super();
    this.lastOrderAmountNumber = lastOrderAmountNumber || 0;
    this.killFlag = killFlag || false;
    this.initialDeposit = initialDeposit;
    this.totalReturn = totalReturn || 0;
    this.totalBet = totalBet || 0;
    this.totalRounds = 0;
    this.phase = phase || RTPPhase.NORMAL;
    this.consecutiveLoses = 0;
    this.supportCount = 0;
    this.supportThreshold = 3;
    this.supportRoundsLeft = 0;
    this.wagerTarget = initialDeposit * Math.floor(Math.random() * 5 + 4); // 随机4-8倍
    this.rtpZone = 'active';
    this.jackpotCount = jackpotCount || 0;
    this.migrate = 1;
    this.recoverLeft = recoverLeft || 0;
    this.recoverCount = recoverCount || 0;
    // 初始化亏损历史记录为空数组
    this.lossTrend = 'stable'; // 初始为稳定
    this.logHeightHistory = logHeightHistory || 0;
  }

  static fromJSON(json: any): BaseRTPController {
    const inst = new SmartForMigrateRTPController(json.initialDeposit);
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
    inst.migrate = json.rtpfor8of2 || 1;
    inst.recoverLeft = json.recoverLeft || 0;
    inst.recoverCount = json.recoverCount || 0;
    inst.lossTrend = json.lossTrend || 'stable'; // 初始为稳定
    inst.killFlag = json.killFlag || false;
    inst.lastOrderAmountNumber = json.lastOrderAmountNumber || 0;
    inst.logHeightHistory = json.logHeightHistory || 0;
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
      migrate: this.migrate,
      recoverLeft: this.recoverLeft,
      recoverCount: this.recoverCount,
      lossTrend: this.lossTrend,
      killFlag: this.killFlag,
      lastOrderAmountNumber: this.lastOrderAmountNumber,
      logHeightHistory: this.logHeightHistory,
    };
  }

  async withdrawSub(): Promise<any> {
    return null;
  }

  addRtpFn(rtp: number[]) {
    return;
  }

  /**
   * 核心算法
   * @param betAmount 投注金额
   * @param winAmount 反奖金额
   * @param currentBalance 当前余额
   * @returns 无
   */
  reportLastResult(
    betAmount: number,
    winAmount: number,
    currentBalance: number,
    justMathBetWin = false,
  ): void {
    this.totalBet += betAmount;
    this.totalReturn += winAmount;
    this.totalRounds += 1;

    if (justMathBetWin) {
      return;
    }

    console.log(
      `reportLastResult: betAmount=${betAmount}, winAmount=${winAmount}, currentBalance=${currentBalance}`,
    );
  }

  getCurrentRTP(): number {
    return this.totalBet === 0 ? 0 : this.totalReturn / this.totalBet;
  }

  /**
   * 37 等于原本的-1
   * @returns
   */
  decideNextSlot(): number {
    return 18;
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
      rtp: this.getCurrentRTP(),
      totalReturn: this.totalReturn,
      totalBet: this.totalBet,
      totalRounds: this.totalRounds,
      supportCount: this.supportCount,
      supportThreshold: this.supportThreshold,
      supportRoundsLeft: this.supportRoundsLeft,
      consecutiveLoses: this.consecutiveLoses,
      rtpZone: this.rtpZone,
      migrate: this.migrate,
      lossTrend: this.lossTrend,
      initialDeposit: this.initialDeposit,
    };
  }
}
