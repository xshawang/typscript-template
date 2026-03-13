import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ApiFailedException } from '../exceptions/api-failed.exception';
import { IBaseResponse } from '../interfaces/response';
import { AppConfigService } from '../shared/services/app-config.service';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: AppConfigService) {}

  private readonly logger = new Logger(BaseExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const httpStatus: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const apiErrorCode: number =
      exception instanceof ApiFailedException
        ? exception.getErrorCode()
        : httpStatus;

    const errorMessage: string =
      exception instanceof HttpException ? exception.message : `${exception}`;

    // 获取堆栈信息
    const stack = (exception as any)?.stack || '';
    let debugInfo = '';

    // 提取第一条含有文件路径和行号的堆栈信息
    const match =
      stack.match(/\(([^)]+\.ts:\d+:\d+)\)/) ||
      stack.match(/at\s+([^)]+\.ts:\d+:\d+)/);
    if (match && match[1]) {
      debugInfo = match[1];
      this.logger.error(debugInfo);
    }

    // 返回基础响应结果
    const resBody: IBaseResponse = {
      msg: errorMessage,
      code: apiErrorCode,
      data: null,
    };
    response.status(httpStatus).send(resBody);
  }
}
