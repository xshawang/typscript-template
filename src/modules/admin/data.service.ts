import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { UserOrderEntity } from '../../entities/order/user-order.entity';
import { PayDetailEntity } from '../../entities/payment/pay-detail.entity';
import { DataListQueryDto } from './data.dto';
import * as dayjs from 'dayjs';
import { JwtAuthService } from '../../common/jwt-auth.service';

@Injectable()
export class DataService {
  private logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(UserOrderEntity)
    private userOrderRepository: Repository<UserOrderEntity>,
    @InjectRepository(PayDetailEntity)
    private payDetailRepository: Repository<PayDetailEntity>,
    private jwtAuthService: JwtAuthService,
  ) {}

  async getDataList(query: DataListQueryDto) {
    try {
      // 设置默认日期范围为最近30天
      let startDate = query.startDate ? new Date(query.startDate) : dayjs().subtract(30, 'day').toDate();
      let endDate = query.endDate ? new Date(query.endDate) : new Date();

      // 每日数据统计
      const dailyPaymentOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'DATE(create_date) as date',
          'COUNT(*) as count',
          'SUM(order_price) as amount'
        ])
        .where('create_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('return_success_flag != 1') // 未退还的订单
        .groupBy('DATE(create_date)')
        .getRawMany();

      const dailyReturnOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'DATE(return_success_date) as date',
          'COUNT(*) as count',
          'SUM(return_price) as amount'
        ])
        .where('return_success_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('return_success_flag = 1') // 已退还的订单
        .groupBy('DATE(return_success_date)')
        .getRawMany();

      // 每月数据统计
      const monthlyPaymentOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'DATE_FORMAT(create_date, "%Y-%m") as month',
          'COUNT(*) as count',
          'SUM(order_price) as amount'
        ])
        .where('create_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('return_success_flag != 1')
        .groupBy('DATE_FORMAT(create_date, "%Y-%m")')
        .getRawMany();

      const monthlyReturnOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'DATE_FORMAT(return_success_date, "%Y-%m") as month',
          'COUNT(*) as count',
          'SUM(return_price) as amount'
        ])
        .where('return_success_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('return_success_flag = 1')
        .groupBy('DATE_FORMAT(return_success_date, "%Y-%m")')
        .getRawMany();

      // 累计数据统计
      const totalPaymentOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'COUNT(*) as count',
          'SUM(order_price) as amount'
        ])
        .where('create_date <= :endDate', { endDate })
        .andWhere('return_success_flag != 1')
        .getRawOne();

      const totalReturnOrders = await this.userOrderRepository
        .createQueryBuilder('order')
        .select([
          'COUNT(*) as count',
          'SUM(return_price) as amount'
        ])
        .where('return_success_date <= :endDate', { endDate })
        .andWhere('return_success_flag = 1')
        .getRawOne();

      // 计算总盈利（累计收款金额 - 退还订单金额）
      const totalRevenue = parseFloat(totalPaymentOrders?.amount || '0');
      const totalRefund = parseFloat(totalReturnOrders?.amount || '0');
      const totalProfit = totalRevenue - totalRefund;

      return {
        code: 0,
        msg: '获取数据成功',
        list: {
          daily: {
            payment: dailyPaymentOrders,
            return: dailyReturnOrders,
            refundRate: dailyReturnOrders.length > 0 
              ? (dailyReturnOrders.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) / 
                 dailyPaymentOrders.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) * 100).toFixed(2) + '%'
              : '0%',
            orderRefundRate: dailyReturnOrders.length > 0 
              ? (dailyReturnOrders.reduce((sum, item) => sum + parseInt(item.count || '0'), 0) / 
                 dailyPaymentOrders.reduce((sum, item) => sum + parseInt(item.count || '0'), 0) * 100).toFixed(2) + '%'
              : '0%'
          },
          monthly: {
            payment: monthlyPaymentOrders,
            return: monthlyReturnOrders
          },
          total: {
            payment: {
              count: parseInt(totalPaymentOrders?.count || '0'),
              amount: parseFloat(totalPaymentOrders?.amount || '0')
            },
            return: {
              count: parseInt(totalReturnOrders?.count || '0'),
              amount: parseFloat(totalReturnOrders?.amount || '0')
            },
            profit: totalProfit
          }
        }
      };
    } catch (error) {
      this.logger.error('获取数据看板失败:', error);
      return { code: 1, msg: '获取数据失败', list: {} };
    }
  }

  verifyToken(token: string) {
    if (!token) {
      return null;
    }
    return this.jwtAuthService.verifyBackendToken(token);
  }
}