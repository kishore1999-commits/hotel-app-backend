import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, VerifyPaymentDto, CancelBookingDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { CurrentUser, Roles } from '../../common/decorators';
import { PaginationDto } from '../../common/dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a booking with Razorpay order' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify Razorpay payment and confirm booking' })
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.bookingsService.verifyPayment(dto);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my bookings' })
  findMyBookings(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.bookingsService.findMyBookings(userId, pagination);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin)' })
  findAll(@Query() pagination: PaginationDto) {
    return this.bookingsService.findAll(pagination);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Body() dto: CancelBookingDto,
  ) {
    const isAdmin = role === Role.HOTEL_ADMIN || role === Role.SUPER_ADMIN;
    return this.bookingsService.cancel(id, userId, dto, isAdmin);
  }
}
