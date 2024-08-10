import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddImageDto, CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantsService } from './variants.service';

@ApiTags('variants')
@Controller('variants')
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) {}

    @Post()
    async create(@Body() createVariantDto: CreateVariantDto) {
        return await this.variantsService.create(createVariantDto);
    }

    @Get('product/:productId')
    async getByProductId(@Param('productId') productId: string) {
        return await this.variantsService.getByProductId(productId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.variantsService.findOne(id);
    }

    @Post('add-image/:id')
    async addImage(@Param('id') variantId: string, @Body() addImageDto: AddImageDto) {
        return await this.variantsService.addImage(variantId, addImageDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
        return this.variantsService.update(id, updateVariantDto);
    }

    @Delete('remove-image/variaant/:variantId/image/:imageId')
    async removeImage(@Param('variantId') variantId: string, @Param('imageId') imageId: string) {
        return await this.variantsService.removeImage(variantId, imageId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.variantsService.remove(id);
    }
}
