import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserAuthGuard } from '../../guards/user-auth.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { IAuthUser } from '../../interfaces/auth';
import { BaseResponse, ListResponse } from '../../common/response-wrapper';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayDepositDto } from '../user/dto/pay-deposit.dto';
import { ApplyRefundDto } from '../user/dto/apply-refund.dto';

@ApiTags('Order')
@Controller('user')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('pay')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '支付押金' })
  @ApiResponse({ status: 200, description: '支付成功' })
  async payDeposit(
    @AuthUser() user: IAuthUser,
    @Body() payDto: PayDepositDto,
  ): Promise<BaseResponse<any>> {
    try {
      if (!payDto.items || !Array.isArray(payDto.items) || payDto.items.length === 0) {
        return BaseResponse.error('请提供有效的物品信息');
      }

      // Validate each item
      for (const item of payDto.items) {
        if (!item.giftId || !item.quantity || !item.price || item.quantity <= 0 || item.price <= 0) {
          return BaseResponse.error('物品信息不完整或无效');
        }
      }

      const order = await this.orderService.createDepositOrder(Number(user.uid), payDto.items);

      return BaseResponse.success({
        orderNo: order.orderNo,
        orderPrice: order.orderPrice,
        orderNum: order.orderNum,
      }, '订单创建成功');
    } catch (error) {
      return BaseResponse.error(error.message || '支付失败', -1);
    }
  }

  @Get('noProcessOrderList')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '获取未处理订单列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getNoProcessOrderList(
    @AuthUser() user: IAuthUser,
  ): Promise<ListResponse<any>> {
    try {
      const orders = await this.orderService.getUserOrdersWithNoRefund(Number(user.uid));

      // Format the response to match the expected structure
      const formattedOrders = orders.map(order => ({
        id: order.id,
        orderNo: order.orderNo,
        orderPrice: order.orderPrice,
        orderNum: order.orderNum,
        userId: order.userId,
        createDate: order.createDate,
        payDate: order.payDate,
        callbackDate: order.callbackDate,
        payChannel: order.payChannel,
        channelId: order.channelId,
        returnDate: order.returnDate,
        returnFlag: order.returnFlag,
        returnPrice: order.returnPrice,
        brokePrice: order.brokePrice,
        returnSuccessDate: order.returnSuccessDate,
        returnSuccessFlag: order.returnSuccessFlag,
      }));

      return ListResponse.list(formattedOrders, '获取成功');
    } catch (error) {
      return ListResponse.list([], error.message || '获取订单列表失败');
    }
  }

  @Post('apply')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '申请退还' })
  @ApiResponse({ status: 200, description: '申请成功' })
  async applyForRefund(
    @AuthUser() user: IAuthUser,
    @Body() applyDto: ApplyRefundDto,
  ): Promise<BaseResponse<any>> {
    try {
      if (!applyDto.orderNo) {
        return BaseResponse.error('请提供订单编号');
      }

      const order = await this.orderService.applyForRefund(applyDto.orderNo, Number(user.uid));

      return BaseResponse.success({
        orderNo: order.orderNo,
        returnDate: order.returnDate,
      }, '申请退还成功');
    } catch (error) {
      return BaseResponse.error(error.message || '申请退还失败', -1);
    }
  }
}