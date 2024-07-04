import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Post()
    async create(@Body() createBrandDto: CreateBrandDto) {
        return await this.brandsService.create(createBrandDto);
    }

    @Get()
    async findAll() {
        return await this.brandsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.brandsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
        return await this.brandsService.update(id, updateBrandDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.brandsService.remove(id);
    }
}
