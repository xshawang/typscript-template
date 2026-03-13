import type { FastifyRequest } from 'fastify';
import type { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';

/**
 * 快速获取IP
 */
export const Ip = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();

  const forwarded = request.headers['x-forwarded-for'] as string;
  const rawIps = forwarded || request.ip || '';

  const ips = rawIps
    .replace(/\s+/g, '') // 清除空格
    .replace(/::ffff:/g, '') // 移除 IPv4 映射
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  // 返回最前端的那个 IP（真实客户端）
  return ips[0] || '';
});

export const UserAgent = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const userAgent = request.headers['user-agent'] as string;
    return userAgent || 'Missing User-Agent';
  },
);

/**
 * 快速获取 request path，并不包括 url params
 */
export const Uri = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return request.url.split('?')[0];
});
