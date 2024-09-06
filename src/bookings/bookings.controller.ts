import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentQueryDto } from 'src/appointment/dto/update-appointment.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsQuery } from './dto/update-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get()
    async findAll(@Query() query: BookingsQuery) {
        return this.bookingsService.findAll(query);
    }

    @Get('byService/:serviceId')
    async findByService(@Query() query: AppointmentQueryDto, @Param('serviceId') serviceId: string) {
        return await this.bookingsService.findByService(serviceId, query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }
}
