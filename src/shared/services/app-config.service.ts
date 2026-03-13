import type { JwtModuleOptions } from '@nestjs/jwt';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { LoggerOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import { TypeORMLogger } from '/@/providers/typeorm-logger';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    console.log('NODE_ENV', this.get('NODE_ENV'));
    return this.get('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get gameConfig(): any {
    return {
      developerId: this.get('game.developerId'),
      returnUrl: this.get('game.returnUrl'),
      rtpLevel: this.get('game.rtpLevel'),
    };
  }

  get appConfig() {
    return {
      port: this.get<number>('application.port'),
      globalPrefix: this.get('application.name'),
      rootUserId: this.get<number>('application.rootUserId'),
      userPwdSalt: this.get('application.userPwdSalt'),
      userDefaultPwd: this.get('application.userDefaultPwd'),
      protectSysPermMenuMaxId: this.get<number>(
        'application.protectSysPermmenuMaxId',
      ),
      protectSysDictionaryMaxId: this.get<number>(
        'application.protectSysDictionaryMaxId',
      ),
      domain: this.get('application.domain'),
    };
  }

  get redisConfig() {
    return {
      keyPrefix: `${this.get('redis.globalPrefix')}:`,
      host: this.get('redis.host'),
      port: this.get<number>('redis.port'),
      db: this.get<number>('redis.db'),
      queueDb: this.get<number>('redis.queue.db'),
      password: this.get('redis.password') || undefined,
    };
  }

  get jwtConfig(): JwtModuleOptions & { expires?: number } {
    return {
      secret: this.get('jwt.secret'),
      expires: this.get<number>('jwt.expires'),
    };
  }

  get frontendJwtConfig(): JwtModuleOptions & { expires?: number } {
    return {
      secret: this.get('frontend_jwt.secret'),
      expiresIn: this.get<number>('frontend_jwt.expires'),
    };
  }

  get backendJwtConfig(): JwtModuleOptions & { expires?: number } {
    return {
      secret: this.get('backend_jwt.secret'),
      expiresIn: this.get<number>('backend_jwt.expires'),
    };
  }

  get typeormConfig(): TypeOrmModuleOptions {
    // LOG_ORM_ENABLE config if use array must be a json string
    const loggerOptions: LoggerOptions = this.get<boolean | string | string[]>(
      'awsdb.logging',
    ) as 'all';

    // entities load
    const entities = [__dirname + '/../../entities/**/*.entity{.ts,.js}'];
    return {
      type: 'mysql',
      logging: loggerOptions,
      logger: new TypeORMLogger(loggerOptions),
      synchronize: false,
      entities,
      maxQueryExecutionTime: 1000, // 超过 1s 的 SQL 会被记录日志
      /**
       * 🧠 连接池配置（mysql2）
       */
      extra: {
        connectionLimit: 10, // 最大连接数，根据负载调优
        connectTimeout: 10000,
        waitForConnections: true,
      },
      replication: {
        master: {
          host: this.get('awsdb.master'),
          port: this.get<number>('awsdb.port'),
          username: this.get('awsdb.username'),
          password: this.get('awsdb.password'),
          database: this.get('awsdb.database'),
        },
        slaves: [
          {
            host: this.get('awsdb.slave'),
            port: this.get<number>('awsdb.port'),
            username: this.get('awsdb.username'),
            password: this.get('awsdb.password'),
            database: this.get('awsdb.database'),
          },
        ],
      },
    };
  }

  get dynamicTypeormConfig(): any {
    // LOG_ORM_ENABLE config if use array must be a json string
    const loggerOptions: LoggerOptions = this.get<boolean | string | string[]>(
      'awsdb.logging',
    ) as 'all';

    const option: TypeOrmModuleOptions = {
      type: 'mysql',
      logging: loggerOptions,
      logger: new TypeORMLogger(loggerOptions),
      synchronize: false,
      maxQueryExecutionTime: 1000, // 超过 1s 的 SQL 会被记录日志
      /**
       * 🧠 连接池配置（mysql2）
       */
      extra: {
        connectionLimit: 10, // 最大连接数，根据负载调优
        connectTimeout: 10000,
        waitForConnections: true,
      },
      replication: {
        master: {
          host: this.get('awsdb.master'),
          port: this.get<number>('awsdb.port'),
          username: this.get('awsdb.username'),
          password: this.get('awsdb.password'),
          database: this.get('awsdb.database'),
        },
        slaves: [
          {
            host: this.get('awsdb.slave'),
            port: this.get<number>('awsdb.port'),
            username: this.get('awsdb.username'),
            password: this.get('awsdb.password'),
            database: this.get('awsdb.database'),
          },
        ],
      },
    };
    return option;
  }

  get swaggerConfig() {
    return {
      enable: this.get<boolean>('swagger.enable'),
      path: this.get('swagger.path'),
    };
  }

  get loggerConfig() {
    return {
      level: this.get('logger.level'),
      maxFiles: this.get<number>('logger.maxFiles'),
    };
  }

  /**
   * internal function
   */
  private get<T = string>(key: string): T {
    const value = this.configService.get<T>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }
    return value;
  }
}
