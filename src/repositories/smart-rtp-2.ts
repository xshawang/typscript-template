// import { BaseRTPController } from './base-smart-rtp';
// import fastJson from 'fast-json-stringify';

// export enum RTPPhase {
//   NORMAL = 'normal',
//   JACKPOT = 'jackpot',
//   SLOW_DOWN = 'slow_down',
//   RECOVER = 'recover',
//   SUPPORT = 'support',
//   // BIGHELP = 'bighelp',
// }
// type JsonStringifyFunction = (input: any) => string;

// export const stringifySmart2: JsonStringifyFunction = fastJson({
//   title: 'SmartFor2RTPController',
//   type: 'object',
//   properties: {
//     initialDeposit: { type: 'number' },
//     totalReturn: { type: 'number' },
//     totalBet: { type: 'number' },
//     totalRounds: { type: 'number' },
//     phase: { type: 'string' },
//     consecutiveLoses: { type: 'number' },
//     supportCount: { type: 'number' },
//     supportThreshold: { type: 'number' },
//     supportRoundsLeft: { type: 'number' },
//     wagerTarget: { type: 'number' },
//     rtpZone: { type: 'string' },
//     jackpotCount: { type: 'number' },
//     rtpfor8of2: { type: 'number' },
//     recoverLeft: { type: 'number' },
//     recoverCount: { type: 'number' },
//     lossHistory: {
//       type: 'array',
//       items: {
//         type: 'object',
//         properties: {
//           betAmount: { type: 'number' },
//           winAmount: { type: 'number' },
//           currentBalance: { type: 'number' },
//         },
//         required: ['betAmount', 'winAmount', 'currentBalance'],
//       },
//     },
//     lossTrend: { type: 'string' },
//     addedRtp: {
//       type: 'array',
//       items: { type: 'number' },
//     },
//     average20Bet: { type: 'number' },
//     in2groupSubGroup: { type: 'string' },
//   },
//   required: [
//     'initialDeposit',
//     'totalReturn',
//     'totalBet',
//     'totalRounds',
//     'phase',
//     'consecutiveLoses',
//     'supportCount',
//     'supportThreshold',
//     'supportRoundsLeft',
//     'wagerTarget',
//     'rtpZone',
//     'jackpotCount',
//     'rtpfor8of2',
//     'recoverLeft',
//     'recoverCount',
//     'lossHistory',
//     'lossTrend',
//     'addedRtp',
//     'average20Bet',
//     'in2groupSubGroup',
//   ],
// });

// export class SmartFor2RTPController extends BaseRTPController {
//   // 玩家累计返奖金额（所有中奖金额的总和）
//   private totalReturn: number;

//   // 玩家累计投注金额（所有下注金额的总和）
//   private totalBet: number;

//   // 累计游戏回合数（统计游戏局数）
//   private totalRounds: number;

//   // 初始充值金额（用于判断低保触发 / 分区计算等）
//   private initialDeposit: number;

//   // 当前RTP阶段：NORMAL / JACKPOT / SLOW_DOWN / RECOVER / SUPPORT
//   private phase: RTPPhase;

//   // 连续未中奖计数器（用于触发小奖扶持）
//   private consecutiveLoses: number;

//   // 已触发的小奖扶持次数（每次触发后增加）
//   private supportCount: number;

//   // 当前小奖扶持触发门槛（初始为5，每次扶持后+2，最高限制可控）
//   private supportThreshold: number;

//   // 当前小奖扶持剩余轮数（例如设置为2轮小扶持，之后回归正常）
//   private supportRoundsLeft: number;

//   // 当前打码目标值 = initialDeposit × 倍数（默认8）
//   // 达到该值即视为完成生命周期，可根据比例判断 RTP 区段
//   private wagerTarget: number;
//   // 当前RTP波动区间：
//   // - active  => 平稳波动（打码低于1/3）
//   // - volatile => 大幅震荡（1/3~2/3）
//   // - crash   => 断崖压制（高打码阶段）
//   private rtpZone: 'startHappy' | 'active' | 'volatile' | 'crash';

//   private jackpotCount: number; // 大奖次数

//   private rtpfor8of2: number;

//   //回升剩余轮数
//   private recoverLeft: number;

//   //触发回升的次数
//   private recoverCount: number;

//   private lossHistory: {
//     betAmount: number;
//     winAmount: number;
//     currentBalance: number;
//   }[];

//   private addedRtp: number[]; // 额外的RTP

//   // 亏损趋势，表示亏损是上升还是下降
//   private lossTrend: 'up' | 'down' | 'stable' | 'sharpUp' | 'sharpDown';

//   // 最近20次投注的平均值
//   private average20Bet: number;

//   private balanceThreshold: number; //盈利上限

//   private in2groupSubGroup: 'top' | 'middle' | 'lower'; // 2组内的子组 1,2,3

//   constructor(
//     initialDeposit: number,
//     phase?: RTPPhase,
//     addedRtp?: number[],
//     jackpotCount?: number,
//     totalReturn?: number,
//     totalBet?: number,
//   ) {
//     super();
//     const in2groupSubGroupRandom = Math.random();
//     let i2r: 'top' | 'middle' | 'lower' = 'lower';
//     if (in2groupSubGroupRandom < 0.05) {
//       i2r = 'top';
//     } else if (in2groupSubGroupRandom < 0.15) {
//       i2r = 'middle';
//     } else {
//       i2r = 'lower';
//     }
//     this.initialDeposit = initialDeposit;
//     this.totalReturn = totalReturn || 0;
//     this.totalBet = totalBet || 0;
//     this.totalRounds = 0;
//     this.phase = phase || RTPPhase.NORMAL;
//     this.consecutiveLoses = 0;
//     this.supportCount = 0;
//     this.supportThreshold = 3;
//     this.supportRoundsLeft = 0;
//     this.wagerTarget = initialDeposit * Math.floor(Math.random() * 10 + 5); // 随机10-15倍
//     this.rtpZone = 'active';
//     this.jackpotCount = jackpotCount || 0;
//     this.rtpfor8of2 = 2;
//     this.recoverLeft = 0;
//     this.recoverCount = 0;
//     // 初始化亏损历史记录为空数组
//     this.lossHistory = [];
//     this.lossTrend = 'stable'; // 初始为稳定
//     this.addedRtp = addedRtp || [
//       ...Array(Math.floor(Math.random() * 5)).fill(37),
//       ...Array(Math.floor(Math.random() * 5)).fill(33),
//     ];
//     this.average20Bet = 0;
//     this.in2groupSubGroup = i2r; // 随机选择2组内的子组
//   }

//   static fromJSON(json: any): SmartFor2RTPController {
//     const inst = new SmartFor2RTPController(json.initialDeposit);
//     inst.totalReturn = json.totalReturn || 0;
//     inst.totalBet = json.totalBet || 0;
//     inst.totalRounds = json.totalRounds || 0;
//     inst.phase = json.phase || RTPPhase.NORMAL;
//     inst.consecutiveLoses = json.consecutiveLoses || 0;
//     inst.supportCount = json.supportCount || 0;
//     inst.supportThreshold = json.supportThreshold || 5;
//     inst.supportRoundsLeft = json.supportRoundsLeft || 0;
//     inst.wagerTarget = json.wagerTarget || inst.initialDeposit * 8;
//     inst.rtpZone = json.rtpZone || 'active';
//     inst.jackpotCount = json.jackpotCount || 0;
//     inst.rtpfor8of2 = json.rtpfor8of2 || 2;
//     inst.recoverLeft = json.recoverLeft || 0;
//     inst.recoverCount = json.recoverCount || 0;
//     inst.lossHistory = json.lossHistory || [];
//     inst.lossTrend = json.lossTrend || 'stable'; // 初始为稳定
//     inst.addedRtp = json.addedRtp || [];
//     inst.average20Bet = json.average20Bet || 0;
//     inst.in2groupSubGroup = json.in2groupSubGroup || 'lower'; // 随机选择2组内的子组
//     return inst;
//   }

//   toJSON() {
//     return {
//       initialDeposit: this.initialDeposit,
//       totalReturn: this.totalReturn,
//       totalBet: this.totalBet,
//       totalRounds: this.totalRounds,
//       phase: this.phase,
//       consecutiveLoses: this.consecutiveLoses,
//       supportCount: this.supportCount,
//       supportThreshold: this.supportThreshold,
//       supportRoundsLeft: this.supportRoundsLeft,
//       wagerTarget: this.wagerTarget,
//       rtpZone: this.rtpZone,
//       jackpotCount: this.jackpotCount,
//       rtpfor8of2: this.rtpfor8of2,
//       recoverLeft: this.recoverLeft,
//       recoverCount: this.recoverCount,
//       lossHistory: this.lossHistory,
//       lossTrend: this.lossTrend,
//       addedRtp: this.addedRtp,
//       average20Bet: this.average20Bet,
//       in2groupSubGroup: this.in2groupSubGroup,
//     };
//   }

//   private mathJackpot(currentBalance: number): boolean {
//     // 当前余额比例 / 初始充值金额 = 当前余额剩余比例
//     const ratio = currentBalance / this.initialDeposit;
//     if (
//       ratio <=
//       Math.random() * (0.12 - 0.05) + 0.05 // 余额小于5%~12%
//     ) {
//       // 如果是0次触发JACKPOT 就是 100% 如果第二次就减半的几率 第三次就是 25% 每次都减半的几率
//       const jackpotChance = Math.pow(0.5, this.jackpotCount);
//       if (Math.random() < jackpotChance) {
//         this.phase = RTPPhase.JACKPOT;
//         this.jackpotCount += Math.floor(Math.random() * 2 + 1);
//         return true;
//       }
//     }
//     return false;
//   }

//   /**
//    * 核心算法
//    * @param betAmount 投注金额
//    * @param winAmount 反奖金额
//    * @param currentBalance 当前余额
//    * @returns 无
//    */
//   reportLastResult(
//     betAmount: number,
//     winAmount: number,
//     currentBalance: number,
//   ): void {
//     this.lossHistory.push({
//       betAmount,
//       winAmount,
//       currentBalance,
//     });

//     this.totalBet += betAmount;
//     this.totalReturn += winAmount;
//     this.totalRounds += 1;
//     const winRadio = (this.totalReturn - this.totalBet) / this.initialDeposit;
//     const startHappyCantWins = [0.07, 0.08, 0.09, 0.1];
//     this.balanceThreshold =
//       this.initialDeposit *
//       { top: 3.55, middle: 2.28, lower: 2.0 }[this.in2groupSubGroup]; // 余额大幅变化的阈值（根据需要调整）

//     // --------------------------必须前置判断的逻辑--------------------------

//     // 判断当前余额是否大于阈值
//     // 如果大于阈值，说明当前余额已经很高了，进入慢慢下降阶段
//     // 已经开启慢慢下降阶段了 就不需要判断了，再下一次充值之前都不会计算

//     // 计算是否可以给予大奖
//     const jboolean = this.mathJackpot(currentBalance);
//     if (jboolean) {
//       return;
//     }

//     if (this.addedRtp.length > 0) {
//       return;
//     }

//     if (
//       currentBalance > this.balanceThreshold ||
//       this.totalBet >= this.wagerTarget ||
//       this.phase === RTPPhase.SLOW_DOWN
//     ) {
//       this.phase = RTPPhase.SLOW_DOWN;
//       const ratio = currentBalance / this.initialDeposit;
//       if (
//         ratio <= Math.random() * (0.12 - 0.05) + 0.05 && // 余额小于5%~12%
//         this.jackpotCount === 0
//       ) {
//         // 如果是0次触发JACKPOT 就是 100% 如果第二次就减半的几率 第三次就是 25% 每次都减半的几率
//         this.addedRtp.push(35);
//         this.jackpotCount += Math.floor(Math.random() * 2 + 1);
//         return;
//       }
//       return;
//     }

//     // 如果进入了连续亏损阶段 并且进入了小奖扶持阶段
//     if (this.phase === RTPPhase.SUPPORT) {
//       this.supportRoundsLeft -= 1;
//       if (this.supportRoundsLeft <= 0) {
//         this.phase = RTPPhase.NORMAL;
//         this.supportCount += 1;
//         this.supportThreshold += 1;
//         if (
//           this.supportThreshold > [9, 13, 16, 20][Math.floor(Math.random() * 4)]
//         ) {
//           //回归正常
//           this.supportThreshold = 1;
//         }
//       }
//       return;
//     }

//     //判断是否需要进入小奖扶持阶段 连续未中奖次数大于supportThreshold
//     if (this.consecutiveLoses >= this.supportThreshold) {
//       this.phase = RTPPhase.SUPPORT;
//       this.supportRoundsLeft = Math.floor(Math.random() * 2 + 1); // 随机1-3轮
//       this.supportCount += 1;
//       this.consecutiveLoses = 0;
//       return;
//     }

//     // --------------------------必须前置判断的逻辑 end--------------------------

//     // 只保留最近 10 次的亏损记录，避免数组过长
//     if (this.lossHistory.length > 21) {
//       this.lossHistory.shift();
//     }

//     // 计算亏损趋势
//     this.calculateLossTrend();

//     // if (this.lossTrend === 'sharpDown') {
//     //   this.phase = RTPPhase.RECOVER;
//     //   this.recoverLeft = Math.floor(Math.random() * 2 + 3); // 随机1-2轮
//     //   this.recoverCount += 1;
//     //   this.lossHistory = [];
//     //   return;
//     // }

//     // if (
//     //   this.average20Bet > 0 &&
//     //   this.average20Bet < this.initialDeposit * 0.1 &&
//     //   currentBalance < this.balanceThreshold * 0.65 &&
//     //   this.totalBet < this.wagerTarget
//     // ) {
//     //   this.phase = RTPPhase.BIGHELP;
//     //   this.lossHistory = [];
//     //   return;
//     // }

//     if (this.lossTrend === 'down' || this.lossTrend === 'stable') {
//       this.phase = RTPPhase.NORMAL;
//     }

//     // 计算当前盈利
//     if (winAmount <= 0) {
//       this.consecutiveLoses += 1;
//     } else {
//       //或者盈利小于投注的50%
//       if (winAmount < betAmount * 0.5) {
//         this.consecutiveLoses += 1;
//       } else {
//         this.consecutiveLoses = 0;
//       }
//     }

//     //判断亏损大于8.5% 进入恢复阶段
//     if (
//       winRadio < -0.085 &&
//       this.phase !== RTPPhase.RECOVER &&
//       this.recoverCount <= 3
//     ) {
//       // 亏损大于8.5% 进入恢复阶段
//       this.phase = RTPPhase.RECOVER;
//       this.recoverLeft = Math.floor(Math.random() * 2 + 1); // 随机1-2轮
//       this.recoverCount += 1;
//     }

//     if (this.phase === RTPPhase.RECOVER) {
//       if (this.recoverLeft <= 0) {
//         this.phase = RTPPhase.NORMAL;
//       }
//       this.recoverLeft -= 1;
//     }

//     // 如果进来了大奖阶段 就回到正常阶段
//     if (this.phase === RTPPhase.JACKPOT) {
//       this.phase = RTPPhase.NORMAL;
//       return;
//     }

//     const wagerRatio = this.totalBet / this.wagerTarget;
//     if (wagerRatio < 0.065) {
//       if (
//         winRadio >
//         startHappyCantWins[
//           Math.floor(Math.random() * startHappyCantWins.length)
//         ]
//       ) {
//         this.rtpZone = 'active';
//       } else {
//         this.rtpZone = 'startHappy';
//       }
//     } else if (wagerRatio < 0.3) {
//       this.rtpZone = 'active';
//     } else if (wagerRatio < 0.55) {
//       this.rtpZone = 'volatile';
//     } else {
//       this.rtpZone = 'crash';
//     }
//   }
//   private calculateLossTrend(): void {
//     // 如果历史记录不足两次，无法计算趋势
//     if (this.lossHistory.length < 20) {
//       this.lossTrend = 'stable';
//       this.average20Bet = 0;
//       return;
//     }

//     // 获取最近 5 次投注数据
//     const recentBets = this.lossHistory.slice(-20);

//     // 计算最近 5 次的总投注金额和总盈亏
//     const totalBetAmount = recentBets.reduce(
//       (sum, bet) => sum + bet.betAmount,
//       0,
//     );
//     const totalWinAmount = recentBets.reduce(
//       (sum, bet) => sum + bet.winAmount,
//       0,
//     );
//     const totalLossAmount = totalBetAmount - totalWinAmount; // 计算总盈亏（如果总投注金额大于总赢得金额，说明亏损）
//     this.average20Bet = totalBetAmount / 20;
//     // 根据余额的变化来计算亏损的趋势
//     const balanceChange =
//       recentBets[recentBets.length - 1].currentBalance -
//       recentBets[0].currentBalance;

//     // 设定大幅变化的阈值（可以根据实际情况调整）
//     const lossThreshold = 0.2; // 亏损大幅变化的阈值 20%（根据需要调整）
//     const balanceThreshold = this.initialDeposit * 0.25; // 余额大幅变化的阈值 20%（根据需要调整）

//     // 根据盈亏和余额变化来判断趋势
//     if (totalLossAmount > 0 && balanceChange < 0) {
//       // 亏损增加且余额减少
//       if (
//         Math.abs(totalLossAmount) / totalBetAmount > lossThreshold ||
//         Math.abs(balanceChange) > balanceThreshold
//       ) {
//         this.lossTrend = 'sharpDown'; // 大幅亏损
//       } else {
//         this.lossTrend = 'down'; // 亏损
//       }
//     } else if (totalLossAmount < 0 && balanceChange > 0) {
//       // 盈利增加且余额增加
//       if (Math.abs(totalLossAmount) > balanceThreshold) {
//         this.lossTrend = 'sharpUp'; // 大幅盈利
//       } else {
//         this.lossTrend = 'up'; // 盈利
//       }
//     } else {
//       this.lossTrend = 'stable'; // 盈亏平衡或者无明显变化
//     }
//   }

//   getCurrentRTP(): number {
//     return this.totalBet === 0 ? 0 : this.totalReturn / this.totalBet;
//   }

//   /**
//    * 37 等于原本的-1
//    *  31级：原来的21等级（上限修改为20倍）=（RPT到200%，中奖倍数区间1倍以下（包括0）和1倍以上各50%，能0赔率概率占比到40% 小于等于1赔率的10% ，其他为大于1赔率的，然后上限为50赔率，赔率大于1到50的中奖概率递减）；
//       32级：原来的22等级=100%中奖 大奖的反奖倍是10 15 20 附近返奖率；
//       33级：0<x=<2(x赔率项)区间，百分百中奖率，中奖率最大坡度平均下降；
//       34级：2<x=<10,(x赔率项)区间，百分百中奖率，中奖率最大坡度平均下降；
//       35级：100%大奖特效最小触发赔率项；
//       36级：100%巨奖特效最小触发赔率项;
//       38 4-8倍
//    * @returns
//    */
//   decideNextSlot(): number {
//     if (this.addedRtp.length > 0) {
//       const idx = Math.floor(Math.random() * this.addedRtp.length);
//       const rtp = this.addedRtp[idx];
//       this.addedRtp[idx] = this.addedRtp[this.addedRtp.length - 1];
//       this.addedRtp.pop(); // 常数时间复杂度删除
//       return rtp;
//     }

//     // 如果NORMAL 说明不走这里
//     // 优先判断特殊 phase，直接命中后返回
//     // if (this.phase === RTPPhase.BIGHELP) {
//     //   const rlist = {
//     //     top: [
//     //       ...Array(1).fill(31),
//     //       ...Array(1).fill(32),
//     //       ...Array(2).fill(34),
//     //       ...Array(1).fill(35),
//     //       ...Array(1).fill(38),
//     //     ],
//     //     middle: [
//     //       ...Array(1).fill(31),
//     //       ...Array(1).fill(32),
//     //       ...Array(2).fill(34),
//     //       ...Array(1).fill(38),
//     //     ],
//     //     lower: [
//     //       ...Array(1).fill(37),
//     //       ...Array(1).fill(33),
//     //       ...Array(1).fill(38),
//     //     ],
//     //   };
//     //   return this.randomPick(rlist[this.in2groupSubGroup]);
//     // }

//     if (this.phase === RTPPhase.JACKPOT) {
//       return this.randomPick([35, 36]);
//     }

//     if (this.phase === RTPPhase.SUPPORT) {
//       //连续不中扶持
//       const rlist = {
//         top: [
//           ...Array(3).fill(34),
//           ...Array(3).fill(32),
//           ...Array(1).fill(38),
//           ...Array(1).fill(31),
//         ],
//         middle: [
//           ...Array(2).fill(34),
//           ...Array(2).fill(38),
//           ...Array(2).fill(31),
//         ],
//         lower: [
//           ...Array(1).fill(34),
//           ...Array(1).fill(38),
//           ...Array(2).fill(31),
//         ],
//       };
//       return this.randomPick(rlist[this.in2groupSubGroup]);
//     }

//     if (this.phase === RTPPhase.SLOW_DOWN) {
//       return this.randomPick([
//         ...Array(55).fill(37),
//         ...Array(3).fill(33),
//         ...Array(1).fill(38),
//         ...Array(1).fill(34),
//         34,
//         31,
//       ]);
//     }

//     if (this.phase === RTPPhase.RECOVER) {
//       return this.randomPick([
//         ...Array(1).fill(32),
//         ...Array(1).fill(31),
//         ...Array(5).fill(33),
//         ...Array(2).fill(38),
//       ]);
//     }

//     // 这里就是NORMAL 阶段了
//     switch (this.rtpZone) {
//       case 'startHappy':
//         return this.randomPick([
//           ...Array(5).fill(37),
//           ...Array(1).fill(33),
//           34,
//           38,
//         ]);
//       case 'active':
//         return this.randomPick([
//           ...Array(20).fill(37),
//           ...Array(2).fill(33),
//           ...Array(1).fill(38),
//           34,
//         ]);
//       case 'volatile':
//         return this.randomPick([
//           ...Array(39).fill(37),
//           ...Array(2).fill(33),
//           ...Array(2).fill(38),
//           34,
//           31,
//         ]);
//       case 'crash':
//         return this.randomPick([
//           ...Array(43).fill(37),
//           ...Array(3).fill(33),
//           ...Array(1).fill(38),
//           ...Array(2).fill(34),
//         ]);
//     }
//   }

//   private randomPick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
//   }

//   private range(start: number, end: number): number[] {
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   }

//   status() {
//     return {
//       phase: this.phase,
//       rtp: this.getCurrentRTP().toFixed(3),
//       totalReturn: this.totalReturn.toFixed(2),
//       totalBet: this.totalBet.toFixed(2),
//       totalRounds: this.totalRounds,
//       supportCount: this.supportCount,
//       supportThreshold: this.supportThreshold,
//       supportRoundsLeft: this.supportRoundsLeft,
//       consecutiveLoses: this.consecutiveLoses,
//       rtpZone: this.rtpZone,
//       rtpfor8of2: this.rtpfor8of2,
//       lossTrend: this.lossTrend,
//       average20Bet: this.average20Bet,
//       initialDeposit: this.initialDeposit,
//       wagerTarget: this.wagerTarget,
//       recoverLeft: this.recoverLeft,
//       recoverCount: this.recoverCount,
//       jackpotCount: this.jackpotCount,
//       in2groupSubGroup: this.in2groupSubGroup,
//     };
//   }
// }
