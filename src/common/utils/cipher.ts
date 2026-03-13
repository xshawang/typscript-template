import * as crypto from 'crypto';
import { enc, MD5, AES, mode, pad } from 'crypto-js';

export function encryptByMD5(text: string) {
  return MD5(text).toString();
}

export function encodeByBase64(text: string) {
  return enc.Utf8.parse(text).toString(enc.Base64);
}

export function decodeByBase64(decode: string) {
  return enc.Base64.parse(decode).toString();
}
export function javaStringHashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash;
}

export function isNumeric(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === '';
}

function mapToSortedCleanObject(map: Record<string, any>): Record<string, any> {
  const sortedEntries = Object.entries(map)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    )
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  return Object.fromEntries(sortedEntries);
}

function buildSignString(
  data: Record<string, any>,
  key: string,
  signKey: string,
): string {
  const parts: string[] = [];

  for (const [k, v] of Object.entries(data)) {
    parts.push(`${k}=${v}`);
  }

  parts.push(`${signKey}=${key}`);
  return parts.join('&');
}

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function sha256ToLowerCaseHash(data: string) {
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex');
}

export function checkSha256Hex(
  obj: Record<string, any>,
  key: string,
  signWebKey: string,
): string {
  const cleanedSortedMap = mapToSortedCleanObject(obj);
  const signStr = buildSignString(cleanedSortedMap, key, signWebKey);
  console.log('Sign string:', signStr);
  return sha256Hex(signStr);
}

export function signByRSA(data: string, privateKey: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

export function verifyByRSA(
  data: string,
  signature: string,
  publicKey: string,
): boolean {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, 'base64');
}
/**
 * AES256 加密函数
 * 使用 ECB 模式和 PKCS7 填充
 */
export function aes256Encrypt(text: string, key: string): string {
  const keyBytes = enc.Utf8.parse(key);
  const encrypted = AES.encrypt(text, keyBytes, {
    mode: mode.ECB,
    padding: pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * AES256 解密函数
 * 使用 ECB 模式和 PKCS7 填充
 */
export function aes256Decrypt(ciphertext: string, key: string): string {
  const keyBytes = enc.Utf8.parse(key);
  const decrypted = AES.decrypt(ciphertext, keyBytes, {
    mode: mode.ECB,
    padding: pad.Pkcs7
  });
  return decrypted.toString(enc.Utf8);
}
