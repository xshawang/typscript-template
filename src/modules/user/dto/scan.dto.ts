import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class ScanDto {
  @ApiProperty({ example: 'o123456789', description: '微信 Open ID' })
  @IsOptional()
  openId?: string;
  @ApiProperty({ example: 'u123456789', description: '微信 Union ID' })
  @IsOptional()
  unionId?: string;
  @ApiProperty({ example: '张三', description: '用户昵称' })
  @IsOptional()
  nickName?: string;
  @ApiProperty({ example: 'http://192.168.1.130:8099/img/acts/densan.jpg', description: '头像URL' })
  @IsOptional()
  avatar?: string;
  @ApiProperty({ example: '13800138000', description: '手机号码' })
  @IsOptional()
  phone?: string;
  @ApiProperty({ example: 10001, description: '渠道 ID' })
  @IsOptional()
  channelId?: number;
  @ApiProperty({ example: 10001, description: '站点 ID' })
  @IsOptional()
  stationId?: number;
}