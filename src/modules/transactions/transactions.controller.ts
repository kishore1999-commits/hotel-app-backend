import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';

@ApiTags('Transactions')
@Controller('bookings/:bookingId/transaction')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get transaction for a booking (Admin)' })
  findByBookingId(@Param('bookingId') bookingId: string) {
    return this.transactionsService.findByBookingId(bookingId);
  }
}
