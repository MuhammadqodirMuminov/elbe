import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @Post()
    async create(@Body() createCollectionDto: CreateCollectionDto) {
        return this.collectionsService.create(createCollectionDto);
    }

    @Get()
    async findAll() {
        return await this.collectionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.collectionsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
        return await this.collectionsService.update(id, updateCollectionDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.collectionsService.remove(id);
    }
}
