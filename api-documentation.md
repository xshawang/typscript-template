# PG游戏平台接口文档

## 项目基本信息

- **配置文件**：bootstrap.yaml
- **服务端口**：7004
- **项目域名**：https://game.gameskkys.com
- **Swagger文档地址**：/documentation

## 接口模块分类

- [用户相关接口](#用户相关接口)
- [游戏相关接口](#游戏相关接口)
- [活动相关接口](#活动相关接口)
- [系统相关接口](#系统相关接口)

## 用户相关接口

### 1. 测试充值

- **接口路径**：`/user/testDeposit`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | amount | string | 是 | Body | 充值金额 |
  | uid | number | 否 | Body | 用户ID |
- **参数验证**：使用 `TestDepositDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 2. 首充礼包

- **接口路径**：`/user/firstRechargeGift`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "status": 1, // 1.活动打开 0.活动关闭
      "time": 1234567890,
      "rewardList": []
    }
  }
  ```

### 3. 用户注册

- **接口路径**：`/user/register`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | phone | string | 是 | Body | 手机号码 |
  | password | string | 是 | Body | 密码 |
  | inviteCode | string | 否 | Body | 邀请码 |
  | channelCode | string | 否 | Body | 渠道码 |
  | ip | string | 是 | Ip | 请求IP地址 |
  | userAgent | string | 是 | UserAgent | 用户代理信息 |
- **参数验证**：使用 `UserRegisterReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "token": "string",
      "uid": 123
    }
  }
  ```

### 4. 用户登录

- **接口路径**：`/user/login`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | phone | string | 是 | Body | 手机号码 |
  | password | string | 是 | Body | 密码 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `UserLoginReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "token": "string",
      "uid": 123
    }
  }
  ```

### 5. 用户登出

- **接口路径**：`/user/logout`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 6. 获取用户信息

- **接口路径**：`/user/info`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "nickname": "string",
      "balance": "string",
      "uid": 123,
      "phone": "string",
      "vipLevel": 1,
      "vipName": "string",
      "cpf": "string",
      "realname": "string",
      "vipReward": "string",
      "inviteCode": "string",
      "channelCode": "string",
      "selfConf": "string"
    }
  }
  ```

### 7. 设置身份信息

- **接口路径**：`/user/setIdentify`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | cpf | string | 是 | Body | 身份证号 |
  | realname | string | 是 | Body | 真实姓名 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `SetIdentifyDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 8. 获取账户余额

- **接口路径**：`/user/account`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "string" // 余额
  }
  ```

### 9. 获取提现所需验证码

- **接口路径**：`/user/withdrawNeedCode`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "string" // 验证码
  }
  ```

## 游戏相关接口

### 1. 获取游戏公司列表

- **接口路径**：`/game-api/companyList`
- **请求方法**：GET
- **认证方式**：无需认证
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "name": "string",
          "photo": "string"
        }
      ]
    }
  }
  ```

### 2. 获取游戏列表

- **接口路径**：`/game-api/gameList`
- **请求方法**：GET
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | companyId | number | 否 | Query | 游戏公司ID |
  | tag | number | 否 | Query | 游戏标签 |
- **参数验证**：使用 `GameListReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "companyId": 1,
          "gameId": 1,
          "name": "string",
          "tag": 1,
          "id": 1,
          "gameCompanyName": "string"
        }
      ]
    }
  }
  ```

### 3. 进入游戏

- **接口路径**：`/game-api/enterGame`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | token | string | 是 | AuthToken | 当前登录用户的认证token |
  | id | number | 是 | Body | 游戏ID |
- **参数验证**：通过 `@AuthUser('uid')` 和 `@AuthToken()` 自动从认证信息中获取，需要登录；使用 `EnterGameReqDtp` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "string" // 游戏链接
  }
  ```

### 4. 验证会话

- **接口路径**：`/game-api/VerifySession`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | operatorSession | string | 是 | Body | 平台提供的token |
  | operatorToken | string | 是 | Body | 运营商开发者id |
  | gameId | string | 是 | Body | 游戏ID |
  | currency | string | 是 | Body | 货币类型 |
- **参数验证**：使用 `VerifySessionReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "playerId": "string",
      "currency": "string",
      "rtpLevel": 11,
      "group": "string",
      "nickName": "string",
      "userId": "string",
      "appId": "string"
    }
  }
  ```

### 5. 获取余额

- **接口路径**：`/game-api/GetBalance`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | gameId | string | 是 | Body | 游戏ID |
  | playerId | string | 是 | Body | 玩家ID |
  | operatorToken | string | 是 | Body | 运营商开发者id |
  | currency | string | 是 | Body | 货币类型 |
- **参数验证**：使用 `GetBalanceReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "balanceAmount": "string",
      "dealTime": 1234567890
    }
  }
  ```

### 6. 投注

- **接口路径**：`/game-api/bet`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | amount | string | 是 | Body | 投注金额 |
  | tradeNo | string | 是 | Body | 总局号 |
  | operatorToken | string | 是 | Body | 运营商开发者id |
  | currency | string | 是 | Body | 货币类型 |
  | playerId | string | 是 | Body | 玩家ID |
  | gameId | string | 是 | Body | 游戏ID |
  | winAmount | string | 是 | Body | 赢的金额 |
  | roundId | string | 是 | Body | 次号 |
  | isEndRound | string | 是 | Body | 对局是否结束 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `BetReqDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "balanceBefore": "string",
      "balanceAfter": "string",
      "rtpLevel": 11,
      "dealTime": 1234567890
    }
  }
  ```

## 活动相关接口

### 1. VIP配置

- **接口路径**：`/activity/vipConfig`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "vipLevel": 1,
          "vipName": "string",
          "vipBet": "string",
          "vipReward": "string",
          "vipWeekBet": "string",
          "vipMonthBet": "string",
          "vipWeekReward": "string",
          "vipMonthReward": "string"
        }
      ],
      "weekBetCode": "string",
      "monthBetCode": "string"
    }
  }
  ```

### 2. 签到配置

- **接口路径**：`/activity/checkInConfig`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 3. 签到状态

- **接口路径**：`/activity/myCheckInState`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "check_in_status": 1, // 签到状态 1 需要充值 2 普通签到 3 加赠签到 4 已签到
      "check_in_day": 1, // 已签到天数
      "continuous_day": 1, // 连续签到天数
      "continuous_box": [] // 已领取的宝箱
    }
  }
  ```

### 4. 领取签到奖励

- **接口路径**：`/activity/receiveCheckInReward`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 5. 领取宝箱奖励

- **接口路径**：`/activity/receiveBoxReward`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | day | number | 是 | Body | 天数 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `ReceiveBoxRewardDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 6. 领取VIP奖励

- **接口路径**：`/activity/receiveVipReward`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 7. 转盘配置

- **接口路径**：`/activity/zhuanpanConfig`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 8. 获取帮助记录

- **接口路径**：`/activity/helpAmount`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 9. 转盘记录

- **接口路径**：`/activity/zhuanpanRecord`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 10. 转盘抽奖

- **接口路径**：`/activity/zhuanpanDraw`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 11. 领取帮助奖励

- **接口路径**：`/activity/receiveHelpAmount`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | type | number | 是 | Body | 类型 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `ReceiveHelpAmountDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 12. 领取任务奖励

- **接口路径**：`/activity/receiveTaskReward`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | type | number | 是 | Body | 类型 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `TaskRecive` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 13. 每周帮助

- **接口路径**：`/activity/weekHple`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 14. 领取每周帮助奖励

- **接口路径**：`/activity/weekHpleRevice`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

## 系统相关接口

### 1. 获取邀请链接

- **接口路径**：`/system/getInviteLinks`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | uid | number | 是 | Query | 目标用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `getInviteLinksDto` 验证查询参数
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "content": "string",
          "isRead": "string",
          "time_unix": "string",
          "id": 1
        }
      ]
    }
  }
  ```

### 2. 未读通知数量

- **接口路径**：`/system/unreadNoticeCount`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "content": "string",
          "isRead": "string",
          "time_unix": "string",
          "id": 1
        }
      ]
    }
  }
  ```

### 3. 通知列表

- **接口路径**：`/system/noticeList`
- **请求方法**：GET
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "content": "string",
          "isRead": "string",
          "time_unix": "string",
          "id": 1
        }
      ]
    }
  }
  ```

### 4. 系统配置

- **接口路径**：`/system/systemConfig`
- **请求方法**：GET
- **认证方式**：无需认证
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "list": [
        {
          "content": "string",
          "isRead": "string",
          "time_unix": "string",
          "id": 1
        }
      ]
    }
  }
  ```

### 5. 标记通知已读

- **接口路径**：`/system/noticeRead`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | id | number | 是 | Body | 通知ID |
  | all | number | 是 | Body | 是否全部标记已读 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `ReadNoticeDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 6. 充值

- **接口路径**：`/system/deposit`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | amount | number | 是 | Body | 充值金额 |
  | ip | string | 是 | Ip | 请求IP地址 |
  | userAgent | string | 是 | UserAgent | 用户代理信息 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `AmountDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "url": "string" // 支付链接
    }
  }
  ```

### 7. ePay支付回调

- **接口路径**：`/system/epay_deposit_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | trade_no | number | 是 | Body | 交易编号 |
  | status | number | 是 | Body | 订单状态 |
  | order_no | string | 是 | Body | 订单号 |
  | dis_order_no | string | 是 | Body | 渠道订单号 |
  | create_time | number | 是 | Body | 创建时间 |
  | sign | string | 是 | Body | 签名结果 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `OrderNotificationDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 8. mPay支付回调

- **接口路径**：`/system/mpay_deposit_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | merchant_id | string | 是 | Body | 商户号 |
  | order_status | string | 是 | Body | 订单状态 |
  | app_id | string | 是 | Body | appId |
  | merchant_order_id | string | 是 | Body | 商户订单号 |
  | system_order_id | string | 是 | Body | 平台订单号 |
  | amount | string | 是 | Body | 订单金额 |
  | account_amount | string | 是 | Body | 用户真实付款金额 |
  | msg | string | 是 | Body | 消息 |
  | sign | string | 是 | Body | 签名结果 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `MpayNotificationDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 9. 系统手动回调

- **接口路径**：`/system/system_deposit_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | id | number | 是 | Body | 订单ID |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `SysDepoistDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 10. U2C支付回调

- **接口路径**：`/system/u2cpay_deposit_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | merchantId | string | 是 | Body | 商户Id |
  | merchantOrderNo | string | 是 | Body | 商户订单号 |
  | orderNo | string | 是 | Body | 平台订单号 |
  | amount | string | 是 | Body | 金额 |
  | status | string | 是 | Body | 订单状态 |
  | currency | string | 是 | Body | 币种 |
  | payType | string | 是 | Body | 代收产品编码 |
  | sign | string | 是 | Body | 签名 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `U2cPaymentOrderDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 11. 四海支付回调

- **接口路径**：`/system/unispay_deposit_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | orderNo | string | 是 | Body | 平台唯一单号 |
  | mchOrderId | string | 是 | Body | 商户订单号 |
  | status | string | 是 | Body | 订单状态 |
  | mchNo | string | 是 | Body | 平台分配商户号 |
  | amount | string | 是 | Body | 代付金额 |
  | sign | string | 是 | Body | 签名 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `UnisPayDepositCallDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 12. 四海支付提现回调

- **接口路径**：`/system/unispay_withdraw_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | orderNo | string | 是 | Body | 平台唯一单号 |
  | mchOrderId | string | 是 | Body | 商户订单号 |
  | status | string | 是 | Body | 订单状态 |
  | mchNo | string | 是 | Body | 平台分配商户号 |
  | amount | string | 是 | Body | 代付金额 |
  | sign | string | 是 | Body | 签名 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `UnisPayDepositCallDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 13. ePay支付提现回调

- **接口路径**：`/system/epay_withdraw_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | trade_no | number | 是 | Body | 交易编号 |
  | status | number | 是 | Body | 订单状态 |
  | order_no | string | 是 | Body | 订单号 |
  | dis_order_no | string | 是 | Body | 渠道订单号 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `EpayOrderInfo` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 14. mPay支付提现回调

- **接口路径**：`/system/mpay_withdraw_back`
- **请求方法**：POST
- **认证方式**：无需认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | merchant_id | string | 是 | Body | 商户号 |
  | order_status | string | 是 | Body | 订单状态 |
  | app_id | string | 是 | Body | appId |
  | merchant_order_id | string | 是 | Body | 商户订单号 |
  | system_order_id | string | 是 | Body | 平台订单号 |
  | amount | string | 是 | Body | 订单金额 |
  | account_amount | string | 是 | Body | 用户真实付款金额 |
  | msg | string | 是 | Body | 消息 |
  | sign | string | 是 | Body | 签名结果 |
  | ip | string | 是 | Ip | 请求IP地址 |
- **参数验证**：使用 `MpayNotificationDto` 验证
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

### 15. 提现申请

- **接口路径**：`/system/withdrawApply`
- **请求方法**：POST
- **认证方式**：需要认证
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 | 描述 |
  |--------|------|------|------|------|
  | uid | number | 是 | AuthUser | 当前登录用户ID |
  | amount | number | 是 | Body | 提现金额 |
- **参数验证**：通过 `@AuthUser('uid')` 自动从认证信息中获取，需要登录；使用 `AmountDto` 验证请求体
- **响应格式**：
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {}
  }
  ```

## 认证说明

- **需要认证的接口**：需要在请求头中携带 `Authorization` 字段，值为 `Bearer {token}`
- **token获取方式**：通过用户登录接口 `/user/login` 或注册接口 `/user/register` 获取

## 响应码说明

- **code: 0**：请求成功
- **code: 非0**：请求失败，具体错误信息在 `msg` 字段中说明

## 注意事项

1. 所有接口的请求和响应格式均为 JSON
2. 涉及金额的字段均为字符串类型，避免精度丢失
3. 时间戳字段均为 Unix 时间戳（秒）
4. 回调接口仅供支付平台调用，请勿手动调用
5. 测试充值接口仅在 Swagger 启用时可用
