import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateHotelDto {
  @ApiProperty({ example: 'Grand Hotel' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'A luxurious 5-star hotel' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'India' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  starRating?: number;

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

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @IsString()
  checkInTime?: string;

  @ApiPropertyOptional({ example: '11:00' })
  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
