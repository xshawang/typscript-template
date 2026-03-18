import { INestApplication, Logger } from '@nestjs/common';
import type { AppConfigService } from './shared/services/app-config.service';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { API_SECURITY_AUTH } from './decorators/swagger.decorator';

/**
 * setup project swagger documentation
 */
export function setupSwagger(
  app: INestApplication,
  config: AppConfigService,
): void {
  const { enable, path } = config.swaggerConfig;
  if (!enable) return;

 
const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '输入: Bearer + 空格 + token',
      },
      'user', // 👈 名字非常重要
    ) 
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
    },
    'admin', // 👈 后台
  );
   
   
  // auth security
  // const documentBuilder = new DocumentBuilder().setTitle(`Api Documentation`);
  // documentBuilder.addSecurity(API_SECURITY_AUTH, {
  //   description: 'Bearer Auth',
  //   type: 'http',
  //   scheme: 'bearer',
  //   bearerFormat: 'JWT',
  // });

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup(path, app, document);

  // started log
  const logger = new Logger('SwaggerModule');
  logger.log(
    `Document running on http://127.0.0.1:${config.appConfig.port}/${path}`,
  );
}
