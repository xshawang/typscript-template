import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { AccountWriteLock } from '/@/constants/cache';

@Injectable()
export class RedisLockService {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisLockService.name);

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient(); // 默认 Redis 实例
  }

  /**
   * 获取锁
   */
  private async acquireLock(
    key: string,
    ttl = 5000,
    waitTimeout = 10000,
    retryDelay = 100,
  ): Promise<string | null> {
    const lockValue = `${Date.now()}-${Math.random()}`;
    const endTime = Date.now() + waitTimeout;

    while (Date.now() < endTime) {
      const result = await this.redis.set(key, lockValue, 'PX', ttl, 'NX');
      if (result === 'OK') {
        return lockValue;
      }
      await this.delay(retryDelay);
    }

    return null;
  }

  /**
   * 释放锁（Lua 脚本保障原子性）
   */
  private async releaseLock(key: string, lockValue: string): Promise<boolean> {
    const lua = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(lua, 1, key, lockValue);
    return result === 1;
  }

  /**
   * 包装执行任务（自动加锁、解锁）
   */
  async runWithLock<T>(
    accountId: number | string,
    task: () => Promise<T>,
    ttl = 5000,
    waitTimeout = 10000,
    retryDelay = 100,
    taskTimeout = 4500, // NEW
  ): Promise<T> {
    const key = `${AccountWriteLock}:${accountId}`;
    const lockValue = await this.acquireLock(key, ttl, waitTimeout, retryDelay);
    if (!lockValue) {
      throw new Error(`获取锁失败: ${key}`);
    }

    try {
      return await this.runWithTimeout(task, taskTimeout);
    } finally {
      const released = await this.releaseLock(key, lockValue);
      if (!released) {
        this.logger.warn(`锁释放失败或已过期: ${key}`);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async runWithTimeout<T>(
    task: () => Promise<T>,
    timeout: number,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('任务执行超时')),
        timeout,
      );
      task()
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }
}
