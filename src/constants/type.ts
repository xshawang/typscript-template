export enum StatusTypeEnum {
  /**
   * 失败、禁用
   */
  Failure = 0,
  Disable = 0,

  /**
   * 成功、启用
   */
  Successful = 1,
  Enable = 1,
}

export enum SysLogTypeEnum {
  /**
   * 登录日志
   */
  Login = 1,

  /**
   * 操作日志
   */
  Operate = 2,
}

export enum SysMenuTypeEnum {
  /**
   * 目录
   */
  Catalogue = 0,

  /**
   * 菜单
   */
  Menu = 1,

  /**
   * 权限
   */
  Permission = 2,
}

export enum BoolTypeEnum {
  False = 0,
  True = 1,
}

export const ZhuanpanTypeEnum = {
  /**
   * 金币
   */
  Coin: 1,

  /**
   * 卡片
   */
  Card: 2,

  /**
   *  卡片列表
   */
  CardList: ['H', 'A', 'p', 'p', 'y'],

  /**
   * 金币列表
   */
  CoinList: ['2', '3', '10', '30', '0.5', '0.1', '100'],
};
