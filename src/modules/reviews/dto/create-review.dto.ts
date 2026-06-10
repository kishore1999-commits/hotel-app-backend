import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great stay!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
