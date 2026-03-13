import * as https from 'https';
import { URL } from 'url';

const BOT_TOKEN = '7516286750:AAGfPZbk5cUu2ddOghj2O_Z33KBxTtzZKHw11';
const CHAT_ID = '-1002526061378';

export function sendNoticeToGroup(text: string): void {
  // const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`);
  // const payload = JSON.stringify({
  //   chat_id: CHAT_ID,
  //   text: text,
  //   parse_mode: 'Markdown',
  // });

  // const options: https.RequestOptions = {
  //   hostname: url.hostname,
  //   path: url.pathname + url.search,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Content-Length': Buffer.byteLength(payload),
  //   },
  //   timeout: 5000, // 超时 5 秒
  // };

  // const req = https.request(options, (res) => {
  //   let body = '';

  //   res.on('data', (chunk) => {
  //     body += chunk;
  //   });

  //   res.on('end', () => {
  //     if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
  //       console.log('✅ Telegram 消息发送成功:', body);
  //     } else {
  //       console.error(
  //         `❌ Telegram 请求失败，状态码: ${res.statusCode}, 返回体:`,
  //         body,
  //       );
  //     }
  //   });

  //   res.on('error', (err) => {
  //     console.error('❌ Telegram 响应出错:', err.message);
  //     res.destroy();
  //   });
  // });

  // req.on('timeout', () => {
  //   console.error('❌ 请求超时');
  //   req.destroy(); // 超时后销毁连接
  // });

  // req.on('error', (err) => {
  //   console.error('❌ 请求发送失败:', err.message);
  // });

  // try {
  //   req.write(payload);
  //   req.end();
  // } catch (err: any) {
  //   console.error('❌ 发送失败（异常）:', err.message);
  //   req.destroy();
  // }
}
