import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../shared/services/app-config.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(AppConfigService) private configService: AppConfigService,
  ) {}

  // 生成前端用户JWT token
  generateFrontendToken(payload: any) {
    const tokenPayload = {
      ...payload,
      type: 'frontend',
      role: 'user',
    };
    const config = this.configService.frontendJwtConfig;
    return this.jwtService.sign(tokenPayload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  // 生成后端管理员JWT token
  generateBackendToken(payload: any) {
    const tokenPayload = {
      ...payload,
      type: 'backend',
      role: payload.role || 'admin', // 'admin' 或 'operator'
    };
    const config = this.configService.backendJwtConfig;
    return this.jwtService.sign(tokenPayload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  // 验证前端用户token
  verifyFrontendToken(token: string) {
    try {
      const config = this.configService.frontendJwtConfig;
      const decoded = this.jwtService.verify(token, {
        secret: config.secret,
      });
      
      if (decoded.type !== 'frontend' || decoded.role !== 'user') {
        return null;
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // 验证后端管理员token
  verifyBackendToken(token: string) {
    try {
      const config = this.configService.backendJwtConfig;
      const decoded = this.jwtService.verify(token, {
        secret: config.secret,
      });
      
      if (decoded.type !== 'backend' || !['admin', 'operator'].includes(decoded.role)) {
        return null;
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  }
}