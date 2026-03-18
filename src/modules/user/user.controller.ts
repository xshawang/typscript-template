import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { BaseResponse } from '../../common/response-wrapper';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginDto } from './dto/login.dto';
import * as qrcode from 'qrcode';
import { Readable } from 'stream';
import { ScanDto } from './dto/scan.dto';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @ApiOperation({ summary: '用户微信登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: FastifyRequest,
  ): Promise<BaseResponse<{ token: string; userInfo: any }>> {
    try {
      // Simulate getting WeChat user info (in real app, you'd call WeChat API)
      const wxUserInfo = {
        openId: loginDto.openId || `wx_${Date.now()}`, // In real app, get from WeChat API
        unionId: loginDto.unionId || null,
        nickName: loginDto.nickName || `用户${Date.now()}`,
        avatarUrl: loginDto.avatarUrl || null,
        phoneNumber: loginDto.phoneNumber || null,
        channel: loginDto.channel || 'weixin',
      };

      // Get client IP
      const ip = req.headers['x-forwarded-for'] as string || 
                 req.headers['x-real-ip'] as string || 
                 req.socket.remoteAddress;

      // Login or register user
      const { user, token } = await this.userService.loginOrRegister(wxUserInfo, ip);

      return BaseResponse.success({
        token: `${token}`,
        userInfo: {
          id: user.id,
          phone: user.phone,
          img: user.img,
          nickName: user.nickName,
          openId: user.openId,
        },
      }, '登录成功');
    } catch (error) {
      return BaseResponse.error(error.message || '登录失败', -1);
    }
  }

  @Get('qrcode')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成二维码' })
  @ApiResponse({ status: 200, description: '生成成功' })
  @ApiQuery({ name: 'channel', required: false, example: 10001, description: '景区channel' })
  @ApiQuery({ name: 'stationId', required: false, example: 10001, description: '景区营业站点' })
  async generateQRCode(
    @Res() res: FastifyReply,
    @Query('channel') channel: string = '10001',
    @Query('stationId') stationId: string = '10001',
  ): Promise<void> {
    try {
      // 构建分享链接
      const shareUrl = `http://192.168.1.3:7004/api/user/share/${channel}/${stationId}`;
      
      // 生成二维码图片的 Buffer
      const qrBuffer = await qrcode.toBuffer(shareUrl, {
        width: 200,
        margin: 2,
      });
      
      // 设置响应头
      res.header('Content-Type', 'image/png');
      res.header('Content-Length', qrBuffer.length);
      
      // 返回二维码图片
      res.send(qrBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: '生成二维码失败' });
    }
  }

  // @Get('share/:channel')
  // @SkipAuth()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: '分享链接' })
  // @ApiResponse({ status: 200, description: '访问成功' })
  // async share(
  //   @Param('channel') channel: string,
  // ): Promise<BaseResponse<any>> {
  //   try {
  //     return BaseResponse.success({
  //       channel,
  //       message: `欢迎访问景区 ${channel} 的分享页面`,
  //     }, '访问成功');
  //   } catch (error) {
  //     return BaseResponse.error(error.message || '访问失败', -1);
  //   }
  // }

  @Post('scan')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户扫码' })
  @ApiResponse({ status: 200, description: '扫码成功' })
  @ApiBody({ type: ScanDto })
  async scan(
    @Body() body: {
      openId: string;
      unionId: string;
      nickName: string;
      avatar: string;
      phone: string;
      channelId: number;
      stationId: number;
    },
    @Req() req: FastifyRequest,
  ): Promise<BaseResponse<any>> {
    try {
      const { openId, unionId, nickName, avatar, phone, channelId, stationId } = body;
      
      // Get client IP
      const ip = req.headers['x-forwarded-for'] as string || 
                 req.headers['x-real-ip'] as string || 
                 req.socket.remoteAddress;
      
      const result = await this.userService.scan({
        openId,
        unionId,
        nickName,
        avatarUrl: avatar,
        phoneNumber: phone,
        channelId,
        stationId,
      }, ip);
      return BaseResponse.success(result, '扫码成功');
    } catch (error) {
      return BaseResponse.error(error.message || '扫码失败', -1);
    }
  }

  @Post('order/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户下单支付' })
  @ApiResponse({ status: 200, description: '支付成功' })
  async pay(
    @Body() body: {
      userId: number;
      giftId: number;
      channelId: number;
      stationId: number;
      num: number;
    },
  ): Promise<BaseResponse<any>> {
    try {
      const { userId, giftId, channelId, stationId, num } = body;
      const result = await this.userService.pay(userId, giftId, channelId, stationId, num);
      return BaseResponse.success(result, '支付成功');
    } catch (error) {
      return BaseResponse.error(error.message || '支付失败', -1);
    }
  }
}