import { nanoid } from 'nanoid';

export function buildUUID(): string {
  return nanoid();
}

export function buildShortUUID(): string {
  return nanoid(10);
}

export function buildInviteCode(): string {
  return nanoid(11);
}
 
export function buildOrderId(): string {
  //格式: T+YYYYMMDD+HHMMSS+随机数
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); //月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const orderId = `${year}${month}${day}${hours}${seconds}${Math.floor(
    Math.random() * 10000,
  )}${Math.floor(Math.random() * 100)}`;
  return orderId;
}
export function timestampUUID(): string {
  //格式: YYYYMMDDHHMMSS
   const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
