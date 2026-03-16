import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin', description: '用户名' })
  @IsString()
  @MaxLength(50)
  userName: string;

  @ApiProperty({ example: 'e10adc3949ba59abbe56e057f20f883e', description: '密码(MD5加密)' })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiProperty({ example: 'device123456', description: '设备ID(32随机唯一)', required: false })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  deviceId?: string;
}