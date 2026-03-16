import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { UserOnlineCachePrefix } from '../../constants/cache';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async loginOrRegister(wxUserInfo: any, ip: string): Promise<{ user: User; token: string }> {
    // Try to find user by openId first
    let user = await this.userRepository.findOne({
      where: { openId: wxUserInfo.openId },
    });

    if (!user) {
      // Create new user if not exists
      user = new User();
      user.phone = wxUserInfo.phoneNumber || null;
      user.img = wxUserInfo.avatarUrl || null;
      user.nickName = wxUserInfo.nickName || `用户${Date.now()}`;
      user.openId = wxUserInfo.openId;
      user.unionId = wxUserInfo.unionId || null;
      user.createDate = new Date();
      user.ip = ip;
      user.channel = wxUserInfo.channel || 'weixin';
      
      user = await this.userRepository.save(user);
    } else {
      // Update user info if exists
      user.phone = wxUserInfo.phoneNumber || user.phone;
      user.img = wxUserInfo.avatarUrl || user.img;
      user.nickName = wxUserInfo.nickName || user.nickName;
      user.updateTime = new Date();
      
      user = await this.userRepository.save(user);
    }

    // Generate JWT token
    const payload = { 
      uid: user.id, 
      accountId: user.id, 
      nickname: user.nickName 
    };
    const token = this.jwtService.sign(payload);

    // Store token in Redis for authentication
    await this.redisService.getClient().setex(
      `${UserOnlineCachePrefix}${user.id}`,
      24 * 60 * 60, // 24 hours
      token,
    );

    return { user, token };
  }

  async findByOpenId(openId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { openId } });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}