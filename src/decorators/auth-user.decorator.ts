import type { FastifyRequest } from 'fastify';
import type { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';
import { IAuthUser } from '../interfaces/auth';

/**
 * 快速获取已通过授权的用户信息，而非手动通过 Request 获取
 */
export const AuthUser = (key?: keyof IAuthUser) => {
  return createParamDecorator((_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = request.authUser;

    return key ? user?.[key] : user;
  })();
};

/**
 * 快速获取请求头中的 Authorization 字段
 * @returns 返回请求头中的 Authorization 字段
 */
export const AuthToken = () => {
  return createParamDecorator((_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers['authorization'];

    return token;
  })();
};
