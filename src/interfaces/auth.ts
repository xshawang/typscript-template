/**
 * JsonWebToken payload object
 */
export interface IAuthUser {
  uid: number;
  accountId: number; //账户id == playerId
  nickname: string;
}
