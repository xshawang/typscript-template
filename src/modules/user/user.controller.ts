import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { BaseResponse } from '../../common/response-wrapper';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginDto } from './dto/login.dto';

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
}