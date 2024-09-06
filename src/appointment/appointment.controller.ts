import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto, UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentService.create(createAppointmentDto);
    }

    @Get()
    async findAll() {
        return this.appointmentService.findAll();
    }

    @Get('byService/:serviceId')
    async findByServiceId(@Param('serviceId') serviceId: string, @Query() query: AppointmentQueryDto) {
        return this.appointmentService.findByServiceId(serviceId, query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.appointmentService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentService.update(id, updateAppointmentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.appointmentService.remove(id);
    }
}
