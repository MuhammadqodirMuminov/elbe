import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLengthDto } from '../dto/length/create.dto';
import { UpdateLengthDto } from '../dto/length/update.dto';
import { LengthDocument } from '../models/length.schema';
import { LengthService } from '../services/length.service';

@ApiTags('Lengths')
@Controller('lengths')
export class LengthController {
    constructor(private readonly lengthService: LengthService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new length' })
    @ApiResponse({ status: 201, description: 'Length has been successfully created.', type: LengthDocument })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async create(@Body() createLengthDto: CreateLengthDto): Promise<LengthDocument> {
        return this.lengthService.create(createLengthDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all lengths' })
    @ApiResponse({ status: 200, description: 'List of all lengths.', type: [LengthDocument] })
    async findAll(): Promise<LengthDocument[]> {
        return this.lengthService.findAll();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a length by ID' })
    @ApiParam({ name: 'id', description: 'Length ID' })
    @ApiResponse({ status: 200, description: 'Length has been successfully updated.', type: LengthDocument })
    @ApiResponse({ status: 404, description: 'Length not found.' })
    async update(@Param('id') id: string, @Body() updateLengthDto: UpdateLengthDto): Promise<LengthDocument> {
        return this.lengthService.update(id, updateLengthDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a length by ID' })
    @ApiParam({ name: 'id', description: 'Length ID' })
    @ApiResponse({ status: 204, description: 'Length has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Length not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.lengthService.remove(id);
    }
}
