// sizes.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSizeDto } from '../dto/size/create.dto';
import { UpdateSizeDto } from '../dto/size/update.dto';
import { SizesDocument } from '../models/sizes.schema';
import { SizesService } from '../services/sizes.service';

@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
    constructor(private readonly sizesService: SizesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new size' })
    @ApiResponse({ status: 201, description: 'Size created successfully.', type: SizesDocument })
    create(@Body() createSizeDto: CreateSizeDto) {
        return this.sizesService.create(createSizeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sizes' })
    @ApiResponse({ status: 200, description: 'List of sizes.', type: [SizesDocument] })
    findAll() {
        return this.sizesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get size by ID' })
    @ApiResponse({ status: 200, description: 'Size details.', type: SizesDocument })
    findOne(@Param('id') id: string) {
        return this.sizesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update size by ID' })
    @ApiResponse({ status: 200, description: 'Size updated successfully.', type: SizesDocument })
    update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
        return this.sizesService.update(id, updateSizeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete size by ID' })
    @ApiResponse({ status: 200, description: 'Size deleted successfully.' })
    remove(@Param('id') id: string) {
        return this.sizesService.remove(id);
    }
}
