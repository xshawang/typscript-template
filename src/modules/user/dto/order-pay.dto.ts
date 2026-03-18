import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {IsArray, ArrayNotEmpty,ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
export class OrderPayDto {

  @ApiProperty({ description: '渠道ID' ,example:10001})
  @IsString()
  channelId: string;

  @ApiProperty({ description: '站点ID',example:10001 })
  @IsString()
  stationId: string;

  @ApiProperty({ description: '礼物列表' })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: '礼物列表 不能为空' })
  @ValidateNested({ each: true })
  @Type(() => OrderPayGiftDto)
  orderPayGifts?: OrderPayGiftDto[];

  @ApiProperty({ description: '总金额',example:20 })
  @IsString()
  price: string;
}

export class OrderPayGiftDto {
  @ApiProperty({ description: '礼物ID',example:1 })
  @IsString()
  giftId: string;

  @ApiProperty({ description: '购买数量',example:1 })
  @IsString()
  num: string;
}