import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdressesService } from './adresses.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';

@ApiTags('address')
@Controller('addresses')
export class AdressesController {
    constructor(private readonly adressesService: AdressesService) {}

    @Post()
    async create(@Body() createAdressDto: CreateAdressDto) {
        return await this.adressesService.create(createAdressDto);
    }

    @Get()
    async findAll() {
        return await this.adressesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.adressesService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAdressDto: UpdateAdressDto) {
        return await this.adressesService.update(id, updateAdressDto);
    }

    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.adressesService.remove(id);
    }
}
