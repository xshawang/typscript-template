import type { IBaseResponse } from '/@/interfaces/response';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';
import { sendNoticeToGroup } from '../common/telegram-bot-utilt';
import {
  RESPONSE_SUCCESS_CODE,
  RESPONSE_SUCCESS_MSG,
} from '/@/constants/response';
import { SKIP_TRANSFORM_DECORATOR_KEY } from '/@/decorators/skip-transform.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<IBaseResponse> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const method = request.method;
    const url = request.url;
    return next.handle().pipe(
      map((data) => {
        const time = Date.now() - now;
        if (time > 2000) {
          const logData = {
            url,
            method,
            time: `${time}ms`,
            body: request.body,
            query: request.query,
            params: request.params,
            referer: request.headers['referer'],
          };
          this.logger.warn(`响应高延迟警告-拦截: ${method} ${url} - ${time}ms`);
          sendNoticeToGroup(
            `响应高延迟警告-耗时拦截:\n\n ${JSON.stringify(logData, null, 2)}`,
          );
        }
        this.logger.log(`响应耗时-拦截: ${method} ${url} - ${time}ms`);
        // check need transform
        const isSkipTransform = this.reflector.getAllAndOverride<boolean>(
          SKIP_TRANSFORM_DECORATOR_KEY,
          [context.getHandler(), context.getClass()],
        );

        if (isSkipTransform) return data;

        return {
          data,
          code: RESPONSE_SUCCESS_CODE,
          msg: RESPONSE_SUCCESS_MSG,
        };
      }),
    );
  }
}
