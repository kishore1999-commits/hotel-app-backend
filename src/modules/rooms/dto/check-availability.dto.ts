import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty({ example: '2024-12-20' })
  @IsNotEmpty()
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2024-12-22' })
  @IsNotEmpty()
  @IsDateString()
  checkOut: string;
}
