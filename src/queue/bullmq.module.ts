import { BullModule, BullRootModuleOptions } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../shared/services/app-config.service';

export const bullmqConfig = (
  configService: AppConfigService,
): BullRootModuleOptions => {
  return {
    connection: {
      host: configService.redisConfig.host,
      port: configService.redisConfig.port,
      password: configService.redisConfig.password,
      db: configService.redisConfig.queueDb,
    },
  };
};

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory(configService: AppConfigService) {
        const config = bullmqConfig(configService);
        console.log(config);
        return config;
      },
      inject: [AppConfigService],
    }),
    BullModule.registerQueueAsync(
      {
        name: 'activity-queue',
      },
      {
        name: 'rebate-queue',
      },
    ),
  ],
  exports: [
    BullModule, // ✅ 让 `BullModule` 可用于其他模块
  ],
})
export class BaseQueueModule {}
