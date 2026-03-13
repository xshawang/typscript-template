import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './filters/base.filter';
import { Authguard } from './guards/auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { setupSwagger } from './setup-swagger';
import { AppConfigService } from './shared/services/app-config.service';
import { AppLoggerService } from './shared/services/app-logger.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  // app config service
  const configService = app.get(AppConfigService);

  // reflector
  const reflector = app.get(Reflector);

  // logger
  app.useLogger(app.get(AppLoggerService));

  // global filters
  app.useGlobalFilters(new BaseExceptionFilter(configService));

  // global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(reflector),
  );

  // global guards
  const jwtService = app.select(SharedModule).get(JwtService);
  const redisService = app.get(RedisService);

  app.useGlobalGuards(
    new Authguard(reflector, jwtService, configService, redisService),
  );

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints)[0];
            const msg = e.constraints[rule];
            return `参数 ${e.property} 验证失败 : ${msg}, 必须存在规则: ${rule}`;
          })[0],
        ),
    }),
  );

  // global prefix
  const { globalPrefix, port } = configService.appConfig;
  app.setGlobalPrefix(globalPrefix);

  // swagger document
  if (configService.swaggerConfig.enable) {
    setupSwagger(app, configService);
  }
  await app.listen(process.env.PORT || port, '0.0.0.0');

  // started log
  const logger = new Logger('NestApplication');
  logger.log(`Server running on ${await app.getUrl()}`);
  console.log(`Server running on ${await app.getUrl()}`);
  return app;
}
