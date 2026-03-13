export class BetReqDto {
  amount: string; //投注金额

  tradeNo: string; //总局号

  operatorToken: string; //运营商开发者id

  currency: string; //货币

  playerId: string; //玩家id

  gameId: string; //游戏id

  winAmount: string; //赢的金额

  roundId: string; //次号(非免费赠送时局号等于次号，免费赠送时总局号相同，次号不同。)

  isEndRound: string; //对局是否结束（非免费时为true,免费赠送时为false,免费赠送最后一次时为true）

  constructor(data: any) {
    this.amount = data.amount;
    this.tradeNo = data.tradeNo;
    this.operatorToken = data.operatorToken;
    this.currency = data.currency;
    this.playerId = data.playerId;
    this.gameId = data.gameId;
    this.winAmount = data.winAmount;
    this.roundId = data.roundId;
    this.isEndRound = data.isEndRound;
  }
}

export class ActivityNoticeDataDto {
  uid: number; //用户id

  amount: string; //金额

  atype: number; //1.充值 2.提现 3.投注 4.投注返奖 5.活动奖励 6.其他

  description?: string; //描述

  constructor(data: any) {
    this.uid = data.uid;
    this.amount = data.amount;
    this.atype = data.atype;
    this.description = data.description;
  }
}
