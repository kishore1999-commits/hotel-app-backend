import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { RoomStatus } from '@prisma/client';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 'Deluxe Suite 101' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'deluxe' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ enum: RoomStatus, default: RoomStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
