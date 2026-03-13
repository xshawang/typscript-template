import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '密码(MD5加密)', example: 'e10adc3949ba59abbe56e057f20f883e' })
  @IsString()
  password: string;

  @ApiProperty({ description: '设备ID(32位随机唯一)', example: 'device1234567890abcdef1234567890ab' })
  @IsString()
  deviceId: string;
}

export class GiftEditDto {
  @ApiProperty({ description: '物品ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '物品价格', example: 50.00, required: false })
  @IsOptional()
  @IsNumber()
  giftPrice?: number;

  @ApiProperty({ description: '物品数量', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  giftNum?: number;

  @ApiProperty({ description: '销售状态 0销售 1不销售', example: 0, required: false })
  @IsOptional()
  @IsNumber()
  vstatus?: number;
}

export class ProcessReturnDto {
  @ApiProperty({ description: '订单编号', example: 'ORDER2023123456789' })
  @IsString()
  orderNo: string;
}

export class ChannelAddDto {
  @ApiProperty({ description: '景区编码', example: 'SCENIC001' })
  @IsString()
  channel: string;

  @ApiProperty({ description: '景区名称', example: '美丽风景区' })
  @IsString()
  channelName: string;

  @ApiProperty({ description: '景区位置', example: '北京市朝阳区', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: '星级', example: 5, required: false })
  @IsOptional()
  @IsNumber()
  star?: number;

  @ApiProperty({ description: '说明', example: '著名旅游景点', required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '联系电话', example: '13800138000', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class GiftManageDto {
  @ApiProperty({ description: '景区ID', example: 1 })
  @IsNumber()
  channelId: number;

  @ApiProperty({ description: '物品名称', example: '雨伞' })
  @IsString()
  giftName: string;

  @ApiProperty({ description: '物品价格', example: 50.00 })
  @IsNumber()
  giftPrice: number;

  @ApiProperty({ description: '物品数量', example: 100 })
  @IsNumber()
  giftNum: number;

  @ApiProperty({ description: '销售状态 0销售 1不销售', example: 0, required: false })
  @IsOptional()
  @IsNumber()
  vstatus?: number = 0;
}