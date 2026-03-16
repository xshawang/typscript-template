import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'o123456789', description: '微信 Open ID' })
  @IsOptional()
  openId?: string;

  @ApiProperty({ example: 'u123456789', description: '微信 Union ID' })
  @IsOptional()
  unionId?: string;

  @ApiProperty({ example: '张三', description: '用户昵称' })
  @IsOptional()
  nickName?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: '头像URL' })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '13800138000', description: '手机号码' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'weixin', description: '来源渠道' })
  @IsOptional()
  channel?: string;
}