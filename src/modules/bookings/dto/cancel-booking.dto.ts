import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Change of plans' })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
