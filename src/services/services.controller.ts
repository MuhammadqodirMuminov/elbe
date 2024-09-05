import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post()
    async create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Get()
    async findAll() {
        return this.servicesService.findAll();
    }

    @Get('byBranch/:branchId')
    async findByBranch(@Param('branchId') branchId: string) {
        return await this.servicesService.findByBranch(branchId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
