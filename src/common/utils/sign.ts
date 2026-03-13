import { encryptByMD5 } from './cipher';
/**
 * 生成游戏签名
 * @param {Object} toSign - 要参与签名的对象（键值对）
 * @returns {string} MD5 签名
 */
export function startGameSign(toSign: any) {
  // 按键名排序
  const sortedKeys = Object.keys(toSign).sort();

  const builder = [];

  for (const key of sortedKeys) {
    const value = toSign[key];

    // 忽略 key 含 "sign" 或 value 为空字符串、null、undefined
    if (
      key.includes('sign') ||
      value === undefined ||
      value === null ||
      value === ''
    ) {
      continue;
    }

    builder.push(`${key}=${value}`);
  }

  const signStr = builder.join('&') + '&';
  return encryptByMD5(signStr);
}
