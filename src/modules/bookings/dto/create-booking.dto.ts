import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hotelId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty({ example: '2024-12-20T14:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2024-12-22T11:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  checkOut: string;

  @ApiProperty({ example: 10000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiPropertyOptional({ example: 'Late check-in requested' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}
