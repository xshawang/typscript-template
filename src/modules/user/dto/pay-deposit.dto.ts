import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GiftItemDto {
  @ApiProperty({ example: 1, description: '物品ID' })
  @IsNumber()
  giftId: number;

  @ApiProperty({ example: 2, description: '物品数量' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 99.99, description: '物品单价' })
  @IsNumber()
  @IsPositive()
  price: number;
}

export class PayDepositDto {
  @ApiProperty({ type: [GiftItemDto], description: '物品列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftItemDto)
  items: GiftItemDto[];
}