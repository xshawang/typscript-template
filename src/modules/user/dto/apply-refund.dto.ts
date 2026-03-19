import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ApplyRefundDto {
  @ApiProperty({ example: 'ORD1773827966184402', description: '订单编号' })
  @IsString()
  @MaxLength(32)
  orderNo: string;
}