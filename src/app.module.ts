import './interfaces/global';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './configuration';
 
import { bullmqConfig } from './queue/bullmq.module';
import { QueueModule } from './queue/queue.module';
import { DynamicEntityModule } from './repositories/dynamic-entity.module';
import { AppConfigService } from './shared/services/app-config.service';
import { AppLoggerService } from './shared/services/app-logger.service';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { AdminModule } from './modules/admin/admin.module';
import { ScheduledTasksModule } from './scheduled/scheduled-tasks.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    RedisModule.forRootAsync(
      {
        useFactory: (configService: AppConfigService) => {
          return {
            readyLog: true,
            config: configService.redisConfig,
          };
        },
        inject: [AppConfigService],
      },
      true,
    ),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return configService.typeormConfig;
      },
      inject: [AppConfigService],
    }),
    ScheduleModule.forRoot(),
    SharedModule,
    BullModule.forRootAsync({
      useFactory(configService: AppConfigService) {
        return bullmqConfig(configService);
      },
      inject: [AppConfigService],
    }),
    QueueModule,

    // business module
    DynamicEntityModule,
    UserModule,
    OrderModule,
    AdminModule,
    ScheduledTasksModule,
  ],
})
export class AppModule { }
