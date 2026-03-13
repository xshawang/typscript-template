
import * as crypto from 'crypto';
import { enc, AES, mode, pad } from 'crypto-js';

/**
 * AES-256-ECB 加密解密工具类
 * 用于HUIDU Gaming API的加解密
 */
export class Aes256Ecb {
  /**
   * AES-256-ECB 加密
   * @param text 要加密的文本
   * @param key 密钥
   * @returns Base64编码的加密结果
   */
  static encrypt(text: string, key: string): string {
    try {
      // 使用crypto-js进行AES-256-ECB加密
      const keyParsed = enc.Utf8.parse(key);
      const encrypted = AES.encrypt(text, keyParsed, {
        mode: mode.ECB,
        padding: pad.Pkcs7,
      });
      return encrypted.toString();
    } catch (error) {
      throw new Error(`AES加密失败: ${error.message}`);
    }
  }

  /**
   * AES-256-ECB 解密
   * @param encryptedText Base64编码的加密文本
   * @param key 密钥
   * @returns 解密后的文本
   */
  static decrypt(encryptedText: string, key: string): string {
    try {
      // 使用crypto-js进行AES-256-ECB解密
      const keyParsed = enc.Utf8.parse(key);
      const decrypted = AES.decrypt(encryptedText, keyParsed, {
        mode: mode.ECB,
        padding: pad.Pkcs7,
      });
      return decrypted.toString(enc.Utf8);
    } catch (error) {
      throw new Error(`AES解密失败: ${error.message}`);
    }
  }
}
