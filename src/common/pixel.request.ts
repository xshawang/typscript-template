import { HttpService } from '@nestjs/axios';
import { sha256ToLowerCaseHash } from './utils/cipher';
import { firstValueFrom } from 'rxjs';
import { MathUtil } from './utils/decimal';
import { Logger } from '@nestjs/common';

export class PixelRequest {
  private httpservice: HttpService;
  private formUrl: string;
  constructor(hs: HttpService, formUrl: string) {
    this.httpservice = hs;
    this.formUrl = formUrl;
  }

  private logger = new Logger('PixelRequest');

  async registerFacebookPost(
    pixelId: string,
    pixelApi: string,
    ip: string,
    phone: string,
    userAgent: string,
  ) {
    this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
    return {};
    // if (pixelId == null || pixelId == '' || pixelId.length < 3) {
      
    // }
    // const payloadReg = {
    //   data: [
    //     {
    //       event_name: 'CompleteRegistration',
    //       event_time: Math.floor(Date.now() / 1000), // ✅ 必须是 10 位 Unix 时间戳（秒）
    //       event_id: `reg-${Date.now()}`,
    //       user_data: {
    //         em: [sha256ToLowerCaseHash(`${phone}@gmail.com`)],
    //         ph: [sha256ToLowerCaseHash(phone)],
    //         client_ip_address: ip,
    //         client_user_agent: userAgent,
    //       },
    //       event_source_url: this.formUrl + '/reigister',
    //       action_source: 'website',
    //     },
    //   ],
    // };
    // const url = `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${pixelApi}`;
    // const response = await firstValueFrom(
    //   this.httpservice.post(url, payloadReg),
    // );
    // this.logger.log(
    //   `Facebook CompleteRegistration 注册回调: ${JSON.stringify(
    //     response.data,
    //   )}`,
    // );
    // return response.data;
  }

  async firstDepositFacebookPost(
    pixelId: string,
    pixelApi: string,
    ip: string,
    phone: string,
    userAgent: string,
    amount: number,
  ) {
    try {
        this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
        return {};
      // if (pixelId == null || pixelId == '' || pixelId.length < 3) {
     
      // }
      // const payloadSubscribe = {
      //   data: [
      //     {
      //       event_name: 'Subscribe',
      //       event_time: Math.floor(Date.now() / 1000), // ✅ 必须是 10 位 Unix 时间戳（秒）
      //       event_id: `first-deposit-${Date.now()}`,
      //       user_data: {
      //         em: [sha256ToLowerCaseHash(`${phone}@gmail.com`)],
      //         ph: [sha256ToLowerCaseHash(phone)],
      //         client_ip_address: ip,
      //         client_user_agent: userAgent,
      //       },
      //       event_source_url: this.formUrl + '/deposit',
      //       action_source: 'website',
      //       custom_data: {
      //         currency: 'USD',
      //         value: MathUtil.mul(amount, 0.17),
      //         content_ids: [`order-${Date.now()}`],
      //         content_type: 'product',
      //       },
      //     },
      //   ],
      // };
      // const url = `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${pixelApi}`;
      // const response = await firstValueFrom(
      //   this.httpservice.post(url, payloadSubscribe),
      // );
      // this.logger.log(
      //   `Facebook Subscribe 首次充值回调: ${JSON.stringify(response.data)}`,
      // );
      // return response.data;
    } catch (e) {
      this.logger.error(
        `Facebook Subscribe 首次充值回调失败: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }

  async depositFacebookPost(
    pixelId: string,
    pixelApi: string,
    ip: string,
    phone: string,
    userAgent: string,
    amount: number,
  ) {
    try {
        this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
        return {};
      // if (pixelId == null || pixelId == '' || pixelId.length < 3) {
      
      // }
      // const payloadSubscribe = {
      //   data: [
      //     {
      //       event_name: 'Purchase',
      //       event_time: Math.floor(Date.now() / 1000), // ✅ 必须是 10 位 Unix 时间戳（秒）
      //       event_id: `deposit-${Date.now()}`,
      //       user_data: {
      //         em: [sha256ToLowerCaseHash(`${phone}@gmail.com`)],
      //         ph: [sha256ToLowerCaseHash(phone)],
      //         client_ip_address: ip,
      //         client_user_agent: userAgent,
      //       },
      //       event_source_url: this.formUrl + '/deposit',
      //       action_source: 'website',
      //       custom_data: {
      //         currency: 'USD',
      //         value: MathUtil.mul(amount, 0.17),
      //         content_ids: [`order-${Date.now()}`],
      //         content_type: 'product',
      //       },
      //     },
      //   ],
      // };
      // const url = `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${pixelApi}`;
      // const response = await firstValueFrom(
      //   this.httpservice.post(url, payloadSubscribe),
      // );
      // this.logger.log(
      //   `Facebook Purchase 充值回调: ${JSON.stringify(response.data)}`,
      // );
      // return response.data;
    } catch (e) {
      this.logger.error(`Facebook Purchase 充值回调失败: ${JSON.stringify(e)}`);
    }
    return {};
  }

  async registerKwaiPost(pixelId: string, pixelApi: string, clickId: string) {
    try {
      this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
      return {};
      // if (pixelId == null || pixelId == '' || pixelId.length < 3) {
        
      // }
      // const payload = {
      //   access_token: pixelApi,
      //   clickid: clickId,
      //   event_name: 'EVENT_COMPLETE_REGISTRATION',
      //   is_attributed: 1,
      //   mmpcode: 'PL',
      //   pixelId: pixelId,
      //   pixelSdkVersion: '9.9.9',
      //   properties: JSON.stringify({
      //     content_id: 'register',
      //     content_type: 'register',
      //     content_name: 'register',
      //   }),
      //   testFlag: false,
      //   third_party: 'games',
      //   trackFlag: true,
      // };
      // const url = `https://www.adsnebula.com/log/common/api`;
      // const response = await firstValueFrom(
      //   this.httpservice.post(url, payload),
      // );
      // this.logger.log(
      //   `快手 EVENT_REGISTER 注册回调: ${JSON.stringify(response.data)}`,
      // );
      // return response.data;
    } catch (e) {
      this.logger.error(
        `快手 EVENT_REGISTER 注册回调失败: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }

  async firstDepositKwaiPost(
    pixelId: string,
    pixelApi: string,
    clickId: string,
  ) {
    try {
        this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
        return {};
      // if (pixelId == null || pixelId == '' || pixelId.length < 3) {
      
      // }
      // const payload = {
      //   access_token: pixelApi,
      //   clickid: clickId,
      //   event_name: 'EVENT_ADD_TO_CART',
      //   is_attributed: 1,
      //   mmpcode: 'PL',
      //   pixelId: pixelId,
      //   pixelSdkVersion: '9.9.9',
      //   properties: JSON.stringify({
      //     content_id: 'register',
      //     content_type: 'register',
      //     content_name: 'register',
      //   }),
      //   testFlag: false,
      //   third_party: 'games',
      //   trackFlag: true,
      // };
      // const url = `https://www.adsnebula.com/log/common/api`;
      // const response = await firstValueFrom(
      //   this.httpservice.post(url, payload),
      // );
      // this.logger.log(
      //   `快手 EVENT_ADD_TO_CART 充值回调: ${JSON.stringify(response.data)}`,
      // );
      // return response.data;
    } catch (e) {
      this.logger.error(
        `快手 EVENT_ADD_TO_CART 充值回调失败: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }

  async depositKwaiPost(pixelId: string, pixelApi: string, clickId: string) {
    try {
      //if (pixelId == null || pixelId == '' || pixelId.length < 3) {
        this.logger.error(`Facebook PixelId 错误: ${pixelId}`);
        return {};
      //}
      // const payload = {
      //   access_token: pixelApi,
      //   clickid: clickId,
      //   event_name: 'EVENT_PURCHASE',
      //   is_attributed: 1,
      //   mmpcode: 'PL',
      //   pixelId: pixelId,
      //   pixelSdkVersion: '9.9.9',
      //   properties: JSON.stringify({
      //     content_id: 'register',
      //     content_type: 'register',
      //     content_name: 'register',
      //   }),
      //   testFlag: false,
      //   third_party: 'games',
      //   trackFlag: true,
      // };
      // const url = `https://www.adsnebula.com/log/common/api`;
      // const response = await firstValueFrom(
      //   this.httpservice.post(url, payload),
      // );
      // this.logger.log(
      //   `快手 EVENT_PURCHASE 充值回调: ${JSON.stringify(response.data)}`,
      // );
      // return response.data;
    } catch (e) {
      this.logger.error(
        `快手 EVENT_PURCHASE 充值回调失败: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }
}
