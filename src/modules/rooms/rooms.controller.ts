import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, QueryRoomDto, CheckAvailabilityDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';

@ApiTags('Rooms')
@Controller()
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'Get all rooms with filters' })
  findAll(@Query() query: QueryRoomDto) {
    return this.roomsService.findAll(query);
  }

  @Get('hotels/:hotelId/rooms')
  @ApiOperation({ summary: 'Get rooms by hotel ID' })
  findByHotel(@Param('hotelId') hotelId: string, @Query() query: QueryRoomDto) {
    return this.roomsService.findByHotel(hotelId, query);
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post('rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a room (Admin)' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Put('rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a room (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete('rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete a room (Admin)' })
  remove(@Param('id') id: string) {
    return this.roomsService.softDelete(id);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Check room availability for given dates' })
  async checkAvailability(@Query() dto: CheckAvailabilityDto) {
    const available = await this.roomsService.checkAvailability(
      dto.roomId,
      new Date(dto.checkIn),
      new Date(dto.checkOut),
    );
    return { available, roomId: dto.roomId, checkIn: dto.checkIn, checkOut: dto.checkOut };
  }
}
