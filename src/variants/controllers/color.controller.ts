import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateColorDto } from '../dto/color/create.dto';
import { UpdateColorDto } from '../dto/color/update.dto';
import { ColorDocument } from '../models/color.schema';
import { ColorService } from '../services/color.service';

@ApiTags('Colors')
@Controller('colors')
export class ColorController {
    constructor(private readonly colorService: ColorService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new color' })
    @ApiResponse({ status: 201, description: 'Color has been successfully created.', type: ColorDocument })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async create(@Body() createColorDto: CreateColorDto): Promise<ColorDocument> {
        return this.colorService.create(createColorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all colors' })
    @ApiResponse({ status: 200, description: 'List of all colors.', type: [ColorDocument] })
    async findAll(): Promise<ColorDocument[]> {
        return this.colorService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.colorService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a color by ID' })
    @ApiParam({ name: 'id', description: 'Color ID' })
    @ApiResponse({ status: 200, description: 'Color has been successfully updated.', type: ColorDocument })
    @ApiResponse({ status: 404, description: 'Color not found.' })
    async update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto): Promise<ColorDocument> {
        return this.colorService.update(id, updateColorDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a color by ID' })
    @ApiParam({ name: 'id', description: 'Color ID' })
    @ApiResponse({ status: 204, description: 'Color has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Color not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.colorService.remove(id);
    }
}
