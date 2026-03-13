import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class DataListQueryDto {
  @ApiProperty({ description: '开始日期', example: '2023-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: '结束日期', example: '2023-12-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}