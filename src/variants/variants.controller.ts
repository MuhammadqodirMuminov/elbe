import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantsService } from './variants.service';

@ApiTags('variants')
@Controller('variants')
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) {}

    @Post()
    async create(@Body() createVariantDto: CreateVariantDto) {
        return this.variantsService.create(createVariantDto);
    }

    @Get()
    findAll() {
        return this.variantsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.variantsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
        return this.variantsService.update(+id, updateVariantDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.variantsService.remove(+id);
    }
}
