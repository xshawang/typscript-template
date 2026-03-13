import { Controller, Post, Get, Body, Query, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { 
  AdminLoginDto, 
  GiftEditDto, 
  ProcessReturnDto, 
  ChannelAddDto, 
  GiftManageDto 
} from './admin.dto';
import { BackendAuthGuard } from '../../guards/backend-auth.guard';

@ApiTags('Admin - 后台管理模块')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('member/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '管理员登录',
    description: '管理员通过用户名和密码进行登录，成功后返回JWT token'
  })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    schema: {
      example: {
        code: 0,
        msg: '登录成功',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  async login(@Body() loginDto: AdminLoginDto) {
    return await this.adminService.login(loginDto);
  }

  @Post('member/gift/edit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BackendAuthGuard)
  @ApiOperation({ 
    summary: '修改景区物料',
    description: '修改景区物料的价格、数量或销售状态'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '管理员JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: GiftEditDto })
  @ApiResponse({ 
    status: 200, 
    description: '修改景区物料结果',
    schema: {
      example: {
        code: 0,
        msg: '修改成功'
      }
    }
  })
  async editGift(
    @Headers('authorization') authHeader: string,
    @Body() giftEditDto: GiftEditDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.adminService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的管理员token' };
    }
    
    return await this.adminService.editGift(giftEditDto);
  }

  @Post('member/gift/process')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BackendAuthGuard)
  @ApiOperation({ 
    summary: '确认退还',
    description: '管理员确认处理用户的退还申请'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '管理员JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: ProcessReturnDto })
  @ApiResponse({ 
    status: 200, 
    description: '处理退还结果',
    schema: {
      example: {
        code: 0,
        msg: '退还处理成功'
      }
    }
  })
  async processReturn(
    @Headers('authorization') authHeader: string,
    @Body() processReturnDto: ProcessReturnDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.adminService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的管理员token' };
    }
    
    return await this.adminService.processReturn(processReturnDto);
  }

  @Post('channel/add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BackendAuthGuard)
  @ApiOperation({ 
    summary: '增加/修改景区信息',
    description: '管理员添加或修改景区的基本信息'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '管理员JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: ChannelAddDto })
  @ApiResponse({ 
    status: 200, 
    description: '操作景区信息结果',
    schema: {
      example: {
        code: 0,
        msg: '添加景区成功'
      }
    }
  })
  async addChannel(
    @Headers('authorization') authHeader: string,
    @Body() channelAddDto: ChannelAddDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.adminService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的管理员token' };
    }
    
    return await this.adminService.addChannel(channelAddDto);
  }

  @Post('gift/manage')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BackendAuthGuard)
  @ApiOperation({ 
    summary: '增加/修改景区物料',
    description: '管理员添加或修改景区的物料信息（名称、价格、数量等）'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '管理员JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiBody({ type: GiftManageDto })
  @ApiResponse({ 
    status: 200, 
    description: '操作景区物料结果',
    schema: {
      example: {
        code: 0,
        msg: '添加物品成功'
      }
    }
  })
  async manageGift(
    @Headers('authorization') authHeader: string,
    @Body() giftManageDto: GiftManageDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.adminService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的管理员token' };
    }
    
    return await this.adminService.manageGift(giftManageDto);
  }
}