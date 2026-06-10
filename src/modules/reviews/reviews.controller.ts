import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a review for a hotel' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Get('hotels/:hotelId/reviews')
  @ApiOperation({ summary: 'Get reviews for a hotel' })
  findByHotel(@Param('hotelId') hotelId: string, @Query() pagination: PaginationDto) {
    return this.reviewsService.findByHotel(hotelId, pagination);
  }
}
