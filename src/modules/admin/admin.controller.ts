import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminOperationsService } from './services/admin-operations.service';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { IAuthUser } from '../../interfaces/auth';
import { BaseResponse, ListResponse, PaginationResponse, PaginationInfo } from '../../common/response-wrapper';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Admin')
@Controller('admin/member')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminOperationsService: AdminOperationsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @ApiOperation({ summary: '管理员/操作员登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(
    @Body() loginDto: AdminLoginDto,
  ): Promise<BaseResponse<{ token: string; userInfo: any }>> {
    try {
      if (!loginDto.userName || !loginDto.password) {
        return BaseResponse.error('用户名和密码不能为空');
      }

      const { admin, token } = await this.adminService.login(
        loginDto.userName,
        loginDto.password,
        loginDto.deviceId
      );

      return BaseResponse.success({
        token,
        userInfo: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
      }, '登录成功');
    } catch (error) {
      return BaseResponse.error(error.message || '登录失败', -1);
    }
  }

  @Post('gift/edit')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '操作员修改景区物料表中价格以及是否销售' })
  @ApiResponse({ status: 200, description: '修改成功' })
  async editGift(
    @AuthUser() user: IAuthUser,
    @Body() editDto: { giftId: number; giftPrice?: number; giftNum?: number; vstatus?: number },
  ): Promise<BaseResponse<any>> {
    try {
      if (!editDto.giftId) {
        return BaseResponse.error('请提供礼品ID');
      }

      const gift = await this.adminOperationsService.updateGift(editDto.giftId, {
        giftPrice: editDto.giftPrice,
        giftNum: editDto.giftNum,
        vstatus: editDto.vstatus,
      });

      return BaseResponse.success({
        id: gift.id,
        giftName: gift.giftName,
        giftPrice: gift.giftPrice,
        giftNum: gift.giftNum,
        vstatus: gift.vstatus,
        channelId: gift.channelId,
      }, '礼品信息更新成功');
    } catch (error) {
      return BaseResponse.error(error.message || '更新失败', -1);
    }
  }

  @Post('gift/process')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '操作员确认退还' })
  @ApiResponse({ status: 200, description: '处理成功' })
  async processRefund(
    @AuthUser() user: IAuthUser,
    @Body() processDto: { orderNo: string },
  ): Promise<BaseResponse<any>> {
    try {
      if (!processDto.orderNo) {
        return BaseResponse.error('请提供订单编号');
      }

      const order = await this.adminOperationsService.processRefund(processDto.orderNo);

      return BaseResponse.success({
        orderNo: order.orderNo,
        returnSuccessFlag: order.returnSuccessFlag,
        returnSuccessDate: order.returnSuccessDate,
        returnPrice: order.returnPrice,
      }, '退还处理成功');
    } catch (error) {
      return BaseResponse.error(error.message || '处理失败', -1);
    }
  }

  @Post('channel/add')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员增加/修改景区信息' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async addEditChannel(
    @AuthUser() user: IAuthUser,
    @Body() channelDto: { id?: number; channel: string; channelName: string; city?: string; star?: number; remark?: string; phone?: string },
  ): Promise<BaseResponse<any>> {
    try {
      if (!channelDto.channel || !channelDto.channelName) {
        return BaseResponse.error('景区编码和景区名称不能为空');
      }

      const channel = await this.adminOperationsService.createOrUpdateChannel(channelDto);

      return BaseResponse.success({
        id: channel.id,
        channel: channel.channel,
        channelName: channel.channelName,
        city: channel.city,
        star: channel.star,
        remark: channel.remark,
        phone: channel.phone,
      }, channelDto.id ? '景区信息更新成功' : '景区信息添加成功');
    } catch (error) {
      return BaseResponse.error(error.message || '操作失败', -1);
    }
  }

  @Post('gift/add')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员增加/修改景区物料' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async addEditGift(
    @AuthUser() user: IAuthUser,
    @Body() giftDto: { id?: number; giftName: string; giftPrice: number; giftNum: number; channelId: number; vstatus?: number },
  ): Promise<BaseResponse<any>> {
    try {
      if (!giftDto.giftName || giftDto.giftPrice === undefined || giftDto.giftNum === undefined || !giftDto.channelId) {
        return BaseResponse.error('礼品名称、价格、数量和景区ID不能为空');
      }

      const gift = await this.adminOperationsService.createOrUpdateGift(giftDto);

      return BaseResponse.success({
        id: gift.id,
        giftName: gift.giftName,
        giftPrice: gift.giftPrice,
        giftNum: gift.giftNum,
        channelId: gift.channelId,
        vstatus: gift.vstatus,
      }, giftDto.id ? '礼品信息更新成功' : '礼品信息添加成功');
    } catch (error) {
      return BaseResponse.error(error.message || '操作失败', -1);
    }
  }

  @Get('data/list')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员查看数据看板' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getDataDashboard(
    @AuthUser() user: IAuthUser,
  ): Promise<BaseResponse<any>> {
    try {
      const dashboardData = await this.adminOperationsService.getDashboardData();

      return BaseResponse.success(dashboardData, '数据看板获取成功');
    } catch (error) {
      return BaseResponse.error(error.message || '获取数据失败', -1);
    }
  }
}