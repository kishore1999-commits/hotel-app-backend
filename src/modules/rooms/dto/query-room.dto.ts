import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum, IsInt } from 'class-validator';
import { RoomStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class QueryRoomDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiPropertyOptional({ example: 'deluxe' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ enum: RoomStatus })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  minCapacity?: number;
}
