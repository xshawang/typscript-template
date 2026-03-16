import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ApplyRefundDto {
  @ApiProperty({ example: 'ORD2023123456789012345678901234', description: '订单编号' })
  @IsString()
  @MaxLength(32)
  orderNo: string;
}