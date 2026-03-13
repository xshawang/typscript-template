import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../shared/services/app-config.service';

@Injectable()
export class BackendAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(AppConfigService) private configService: AppConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    
    try {
      const config = this.configService.backendJwtConfig;
      const decoded = this.jwtService.verify(token, {
        secret: config.secret
      });
      
      // 验证token类型是否为后端管理员
      if (decoded.type !== 'backend' || !['admin', 'operator'].includes(decoded.role)) {
        return false;
      }
      
      request.admin = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}