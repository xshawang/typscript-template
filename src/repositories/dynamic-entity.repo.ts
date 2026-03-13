import { Injectable } from '@nestjs/common';
import { DataSource, EntitySchema, Repository } from 'typeorm';
import { AppConfigService } from '../shared/services/app-config.service';
import {
  createEntityBetRecordSchema,
  createEntityFundsRecordSchema,
} from './dynamic-entity';

const TABLE_PREFIX = {
  bet: 'bet_record_',
  funds: 'user_funds_',
};

function getPreviousQuarterTag() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  const currentQuarter = Math.floor(month / 3) + 1;

  let prevQuarter = currentQuarter - 1;
  let prevYear = year;

  if (prevQuarter === 0) {
    prevQuarter = 4;
    prevYear -= 1;
  }

  return `${prevYear}_q${prevQuarter}`;
}

function getQuarterTableTags(startYear = 2024, years = 4): string[] {
  const result: string[] = [];
  for (let y = startYear; y < startYear + years; y++) {
    for (let q = 1; q <= 4; q++) {
      result.push(`${y}_q${q}`);
    }
  }
  return result;
}

function getQuarterTag(date: Date): string {
  const year = date.getFullYear();
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${year}_q${quarter}`;
}

@Injectable()
export class DynamicEntityRepo {
  private dataSource: DataSource;
  private schemaCache = new Map<string, EntitySchema>();

  constructor(private readonly configService: AppConfigService) {
    // const entities: EntitySchema[] = [];
    // const tags = getQuarterTableTags(2024, 4);

    // for (const tag of tags) {
    //   const betTable = TABLE_PREFIX.bet + tag;
    //   const fundsTable = TABLE_PREFIX.funds + tag;

    //   const betSchema = createEntityBetRecordSchema(betTable);
    //   const fundsSchema = createEntityFundsRecordSchema(fundsTable);

    //   entities.push(betSchema, fundsSchema);
    //   this.schemaCache.set(betTable, betSchema);
    //   this.schemaCache.set(fundsTable, fundsSchema);
    // }

    // this.dataSource = new DataSource({
    //   ...this.configService.dynamicTypeormConfig,
    //   entities,
    //   synchronize: false,
    // });

    // this.dataSource.initialize().then(() => {
    //   console.log(`✅ 初始化完成：动态注册 ${entities.length} 张季度表`);
    // });
  }

  /**
   * 根据时间范围获取资金记录表
   * @param start
   * @param end
   * @returns
   */
  async getFundsRepositoriesByTime(
    start: Date,
    end: Date,
  ): Promise<Repository<any>[]> {
    const tags = new Set<string>();
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1); // 月初对齐

    while (cursor <= end) {
      tags.add(getQuarterTag(cursor));
      cursor.setMonth(cursor.getMonth() + 1); // 安全推进一个月
    }

    return Array.from(tags).map((tag) => {
      const table = TABLE_PREFIX.funds + tag;
      return this.dataSource.getRepository(table);
    });
  }

  /**
   * 根据时间范围获取投注记录表
   * @param start
   * @param end
   * @returns
   */
  async getBetRepositoriesByRange(
    start: Date,
    end: Date,
  ): Promise<Repository<any>[]> {
    const before = new Set<string>();
    const cursor = new Date(start);

    while (cursor <= end) {
      before.add(getQuarterTag(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const tags = Array.from(before);
    const repos: Repository<any>[] = [];

    for (const tag of tags) {
      const table = TABLE_PREFIX.bet + tag;
      repos.push(this.dataSource.getRepository(table));
    }
    return repos;
  }

  /**
   * 获取当前季度的资金记录表
   * @returns
   */
  async getFundsRecordRepository<T = any>(): Promise<Repository<T>> {
    const table = TABLE_PREFIX.funds + getQuarterTag(new Date());
    return this.dataSource.getRepository(table);
  }

  /**
   * 获取上个季度的资金记录表
   * @returns
   */
  async getPreviousFundsRepository<T = any>(): Promise<Repository<T>> {
    const table = TABLE_PREFIX.funds + getPreviousQuarterTag();
    return this.dataSource.getRepository(table);
  }

  /**
   * 获取当前季度的投注记录表
   * @returns
   */
  async getBetRecordRepository<T = any>(): Promise<Repository<T>> {
    const table = TABLE_PREFIX.bet + getQuarterTag(new Date());
    return this.dataSource.getRepository(table);
  }

  /**
   * 获取上个季度的投注记录表
   * @returns
   */
  async getPreviousBetRepository<T = any>(): Promise<Repository<T>> {
    const table = TABLE_PREFIX.bet + getPreviousQuarterTag();
    return this.dataSource.getRepository(table);
  }
}
