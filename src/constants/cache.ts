// user online cache by user id
export const UserOnlineCachePrefix = 'user:online:';
export const UserRtpLevelPrefix = 'user:rtpLevel:';
export const UserRtpLevelChangePrefix = 'user:rtpLevel-change:';
export const AccountWriteLock = 'lock:account-lock-';
export const PGWATERLEVEL = 'config:BigWaterLevel';
export const RADIO28 = 'config:rtpradio28';
export const PROFITORLOSSADDRTP = 'user:profitOrLossAddRtp:';
export const USER_WITHDRAW_QUEUE = 'user:withdrawQueue:';
export const USER_LASTAMOUNT_HELP_FLAG = 'user:lastAmountHelpFlag:';

export type WaterEntity = {
  initWater: number;
  maxKeepWater: number;
  minKeepWater: number;
  currentWater: number;
};

export const redisCacheKey = 'rtp_user:cache:';
export const UniqiueId = [
  ...[1001, 1002, 1003, 1004, 1006, 1083, 1014, 1013, 1085, 1137], //pg
  ...[1007, 1008, 1009, 1010, 1011, 1015, 1016, 1027, 1033, 1138], //pg-new 2025-04-24
  ...[1069, 1066, 1055, 1056, 1057, 1061, 1071], //tada
];

export const redisDepositCacheKey = 'deposit:cache:';
