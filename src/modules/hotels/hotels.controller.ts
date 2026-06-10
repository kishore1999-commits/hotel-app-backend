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
import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto, QueryHotelDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hotels with search & filters' })
  findAll(@Query() query: QueryHotelDto) {
    return this.hotelsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a hotel (Admin)' })
  create(@Body() dto: CreateHotelDto) {
    return this.hotelsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a hotel (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateHotelDto) {
    return this.hotelsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOTEL_ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete a hotel (Admin)' })
  remove(@Param('id') id: string) {
    return this.hotelsService.softDelete(id);
  }
}
