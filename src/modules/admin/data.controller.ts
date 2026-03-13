import { Controller, Get, Query, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { DataService } from './data.service';
import { DataListQueryDto } from './data.dto';
import { BackendAuthGuard } from '../../guards/backend-auth.guard';

@ApiTags('Admin - 数据看板')
@Controller('admin')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('data/list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BackendAuthGuard)
  @ApiOperation({ 
    summary: '数据看板 - 展示各类统计数据',
    description: '展示每日、每月和累计的支付订单数量、金额，以及退还订单的相关数据'
  })
  @ApiHeader({
    name: 'Authorization',
    description: '管理员JWT token，格式为 Bearer {token}',
    required: true
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    description: '开始日期，格式 YYYY-MM-DD',
    example: '2023-01-01'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    description: '结束日期，格式 YYYY-MM-DD',
    example: '2023-12-31'
  })
  @ApiResponse({ 
    status: 200, 
    description: '数据看板结果',
    schema: {
      example: {
        code: 0,
        msg: '获取数据成功',
        list: {
          daily: {
            payment: [
              {
                date: '2023-01-01',
                count: 10,
                amount: '1000.00'
              }
            ],
            return: [
              {
                date: '2023-01-02',
                count: 5,
                amount: '500.00'
              }
            ],
            refundRate: '50.00%',
            orderRefundRate: '50.00%'
          },
          monthly: {
            payment: [
              {
                month: '2023-01',
                count: 100,
                amount: '10000.00'
              }
            ],
            return: [
              {
                month: '2023-01',
                count: 50,
                amount: '5000.00'
              }
            ]
          },
          total: {
            payment: {
              count: 1000,
              amount: 100000.00
            },
            return: {
              count: 500,
              amount: 50000.00
            },
            profit: 50000.00
          }
        }
      }
    }
  })
  async getDataList(
    @Headers('authorization') authHeader: string,
    @Query() query: DataListQueryDto,
  ) {
    const token = authHeader?.substring(7); // 移除 "Bearer " 前缀
    const decodedToken = this.dataService.verifyToken(token);
    
    if (!decodedToken) {
      return { code: 1, msg: '无效的管理员token', list: {}, total: 0 };
    }
    
    return await this.dataService.getDataList(query);
  }
}