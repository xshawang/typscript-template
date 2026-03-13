import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ description: '微信授权码', example: '081Ldabcdeabcdeabcdeabcdeabcdeabcde' })
  @IsString()
  code: string;
}

export class PayDepositItemDto {
  @ApiProperty({ description: '物品ID', example: 1 })
  @IsNumber()
  giftId: number;

  @ApiProperty({ description: '物品数量', example: 2 })
  @IsNumber()
  giftNum: number;

  @ApiProperty({ description: '物品价格', example: 50.00 })
  @IsNumber()
  giftPrice: number;
}

export class PayDepositDto {
  @ApiProperty({ description: '押金物品列表', type: [PayDepositItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayDepositItemDto)
  items: PayDepositItemDto[];
}

export class ApplyReturnDto {
  @ApiProperty({ description: '订单编号', example: 'ORDER2023123456789' })
  @IsString()
  orderNo: string;
}

export class OrderListQueryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}