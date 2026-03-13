import './interfaces/global';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './configuration';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { bullmqConfig } from './queue/bullmq.module';
import { QueueModule } from './queue/queue.module';
import { DynamicEntityModule } from './repositories/dynamic-entity.module';
import { AppConfigService } from './shared/services/app-config.service';
import { AppLoggerService } from './shared/services/app-logger.service';
import { SharedModule } from './shared/shared.module';
import { ScheduledTasksService } from './shared/scheduled-tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtConfig.secret,
        signOptions: { expiresIn: configService.jwtConfig.expires },
      }),
      inject: [AppConfigService],
    }),
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
    SystemModule,
    UserModule,
    AdminModule,
  ],
  providers: [
    ScheduledTasksService,
  ],
})
export class AppModule { }
