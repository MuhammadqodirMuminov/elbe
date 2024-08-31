// size-guide.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSizeGuideDto } from '../dto/size-guide/create.dto';
import { UpdateSizeGuideDto } from '../dto/size-guide/update.dto';
import { SizeGuideDocument } from '../models/size-guide.schema';
import { SizeGuideService } from '../services/size-guide.service';

@ApiTags('Size Guide')
@Controller('size-guide')
export class SizeGuideController {
    constructor(private readonly sizeGuideService: SizeGuideService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new size guide' })
    @ApiResponse({ status: 201, description: 'Size Guide created successfully.', type: SizeGuideDocument })
    async create(@Body() createSizeGuideDto: CreateSizeGuideDto) {
        return this.sizeGuideService.create(createSizeGuideDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all size guides' })
    @ApiResponse({ status: 200, description: 'List of size guides.', type: [SizeGuideDocument] })
    async findAll() {
        return this.sizeGuideService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get size guide by ID' })
    @ApiResponse({ status: 200, description: 'Size Guide details.', type: SizeGuideDocument })
    async findOne(@Param('id') id: string) {
        return this.sizeGuideService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update size guide by ID' })
    @ApiResponse({ status: 200, description: 'Size Guide updated successfully.', type: SizeGuideDocument })
    async update(@Param('id') id: string, @Body() updateSizeGuideDto: UpdateSizeGuideDto) {
        return this.sizeGuideService.update(id, updateSizeGuideDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete size guide by ID' })
    @ApiResponse({ status: 200, description: 'Size Guide deleted successfully.' })
    async remove(@Param('id') id: string) {
        return this.sizeGuideService.remove(id);
    }
}
