import { Controller, Post, Get, Body, Query, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto, PayDepositDto, ApplyReturnDto, OrderListQueryDto } from './user.dto';
import { FrontendAuthGuard } from '../../guards/frontend-auth.guard';

@ApiTags('User - 用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '用户登录（微信登录）',
    description: '用户通过微信授权码进行登录，成功后返回JWT token'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    schema: {
      example: {
        code: 0,
        msg: '登录成功',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        userInfo: {
          id: 1,
          phone: '13800138000',
          img: 'https://example.com/avatar.jpg',
          nickName: '张三',
          openId: 'o123456789',
          unionId: null,
          createDate: '2023-01-01T00:00:00.000Z',
          ip: '192.168.1.1',
          channel: 'weixin'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.code);
  }

  @Post('pay')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FrontendAuthGuard)
  @ApiOperation({ 
    summary: '支付押金',
    description: '用户支付租赁物品的押金，需要提供物品ID、数量和价格信息'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '用户JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: PayDepositDto })
  @ApiResponse({ 
    status: 200, 
    description: '支付押金结果',
    schema: {
      example: {
        code: 0,
        msg: '支付押金成功',
        orderNo: 'ORDER2023123456789'
      }
    }
  })
  async payDeposit(
    @Headers('authorization') authHeader: string,
    @Body() payDepositDto: PayDepositDto,
  ) {
    // Guard已经验证了token并解析了用户信息
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.userService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的token' };
    }
    
    return await this.userService.payDeposit(decodedToken.userId, payDepositDto);
  }

  @Get('noProcessOrderList')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FrontendAuthGuard)
  @ApiOperation({ 
    summary: '获取未处理订单列表',
    description: '获取用户的订单列表，未退还在前，按时间倒序排列'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '用户JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: '获取订单列表结果',
    schema: {
      example: {
        code: 0,
        msg: '获取订单列表成功',
        list: [
          {
            id: 1,
            orderNo: 'ORDER2023123456789',
            orderPrice: 100.00,
            orderNum: 2,
            userId: 1,
            channelId: 1,
            returnDate: null,
            returnFlag: 0,
            returnPrice: 0.00,
            brokePrice: 0.00,
            returnSuccessDate: null,
            returnSuccessFlag: 0,
            createDate: '2023-01-01T00:00:00.000Z',
            payDate: '2023-01-01T00:00:00.000Z',
            callbackDate: null,
            payChannel: 'wechat',
          }
        ],
        total: 1
      }
    }
  })
  async getOrderList(
    @Headers('authorization') authHeader: string,
    @Query() query: OrderListQueryDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.userService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的token', list: [], total: 0 };
    }
    
    return await this.userService.getOrderList(decodedToken.userId, query.page, query.limit);
  }

  @Post('apply')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FrontendAuthGuard)
  @ApiOperation({ 
    summary: '申请退还',
    description: '用户申请退还订单中的物品'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '用户JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: ApplyReturnDto })
  @ApiResponse({ 
    status: 200, 
    description: '申请退还结果',
    schema: {
      example: {
        code: 0,
        msg: '申请退还成功'
      }
    }
  })
  async applyReturn(
    @Headers('authorization') authHeader: string,
    @Body() applyReturnDto: ApplyReturnDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.userService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的token' };
    }
    
    return await this.userService.applyReturn(decodedToken.userId, applyReturnDto.orderNo);
  }
}