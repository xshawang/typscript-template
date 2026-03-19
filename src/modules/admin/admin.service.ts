import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { UserOnlineCachePrefix } from '../../constants/cache';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<Admin> {
    // MD5 hash the password
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    console.log('username', username, '  password:', password, '   hashedPassword', hashedPassword);
    const admin = await this.adminRepository.findOne({
      where: { username, password: hashedPassword },
    });

    return admin;
  }

  async login(username: string, password: string, deviceId: string): Promise<{ admin: Admin; token: string; roleType: number; }> {
    const admin = await this.validateAdmin(username, password);
    
    if (!admin) {
      throw new Error('用户名或密码错误');
    }

    // Update device ID if provided
    // if (deviceId) {
    //   admin.deviceId = deviceId;
    //   await this.adminRepository.save(admin);
    // }

    // Generate JWT token with admin prefix
    const payload = { 
      uid: admin.id, 
      accountId: admin.id, 
      nickname: admin.username,
      role: 'admin',
      roleType:admin.role
    };
    const token = this.jwtService.sign(payload, { expiresIn: '24h' });

    // Store token in Redis for authentication with admin prefix
    await this.redisService.getClient().setex(
      `${UserOnlineCachePrefix}admin_${admin.id}`,
      24 * 60 * 60, // 24 hours
      `admin_${token}`,
    );
    
    return { admin, token: `${token}`,roleType:admin.role };
  }

  async findById(id: number): Promise<Admin> {
    return await this.adminRepository.findOne({ where: { id } });
  }
}