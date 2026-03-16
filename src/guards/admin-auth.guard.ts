import type { FastifyRequest } from 'fastify';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_DECORATOR_KEY } from '/@/decorators/skip-auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { AppConfigService } from '/@/shared/services/app-config.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { UserOnlineCachePrefix } from '/@/constants/cache';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: AppConfigService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // to determine whether the interface needs authentication
    // use the @SkipAuth() decorator to skip authentication
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isSkipAuth) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // check the token is valid
    const token = request.headers['authorization']?.trim();
    if (isEmpty(token)) {
      throw new UnauthorizedException();
    }

    // Check if token is admin token (starts with 'admin_')
    if (!token.startsWith('admin_')) {
      throw new UnauthorizedException('Invalid admin token');
    }

    // Remove 'admin_' prefix for verification
    const actualToken = token.substring('admin_'.length);

    try {
      const payload = this.jwtService.verify(actualToken);
      // Ensure the payload has isAdmin flag
      if (!payload.isAdmin) {
        throw new UnauthorizedException('Invalid admin token');
      }
      request.authUser = payload;
    } catch {
      throw new UnauthorizedException();
    }

    // check the jwt payload is valid
    if (isEmpty(request.authUser)) {
      throw new Error('jwt payload is invalid');
    }

    // check is expired
    const cacheToken = await this.redisService
      .getClient()
      .get(`${UserOnlineCachePrefix}admin_${request.authUser.uid}`);

    if (isEmpty(cacheToken) || cacheToken !== token) {
      throw new UnauthorizedException();
    }

    // can active
    return true;
  }
}
