import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Abttribute, AddImageDto, ColorAttribute, CreateVariantDto } from './dto/create-variant.dto';
import { UpdateAttributeDto, UpdateColorDto, UpdateVariantDto } from './dto/update-variant.dto';
import { VariantsService } from './variants.service';

@ApiTags('variants')
@Controller('variants')
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) {}

    @Post()
    async create(@Body() createVariantDto: CreateVariantDto) {
        return await this.variantsService.create(createVariantDto);
    }

    @Post('add-image/:id')
    async addImage(@Param('id') variantId: string, @Body() addImageDto: AddImageDto) {
        return await this.variantsService.addImage(variantId, addImageDto);
    }

    @Post('add-attribute/:id')
    async addAttribute(@Param('id') variantId: string, @Body() addAttributeDto: Abttribute) {
        return await this.variantsService.addAttribute(variantId, addAttributeDto);
    }

    @Post('add-color/:variantId')
    async addColor(@Param('variantId') variantId: string, @Body() addColor: ColorAttribute) {
        return await this.variantsService.addColor(variantId, addColor);
    }

    @Get('product/:productId')
    async getByProductId(@Param('productId') productId: string) {
        return await this.variantsService.getByProductId(productId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.variantsService.findOne(id);
    }

    @Patch('update-attribute/variant/:varianId/attribute/:attributeId')
    async updateAttribute(@Param('varianId') varianId: string, @Param('attributeId') attributeId: string, @Body() body: UpdateAttributeDto) {
        return await this.variantsService.updateAttribute(varianId, attributeId, body);
    }

    @Patch('update-color/variant/:variantId/color/:colorId')
    async updateColor(@Param('variantId') variantId: string, @Param('colorId') colorId: string, @Body() updateColorDto: UpdateColorDto) {
        return await this.variantsService.updateColor(variantId, colorId, updateColorDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
        return this.variantsService.update(id, updateVariantDto);
    }

    @Delete('remove-image/variant/:variantId/image/:imageId')
    async removeImage(@Param('variantId') variantId: string, @Param('imageId') imageId: string) {
        return await this.variantsService.removeImage(variantId, imageId);
    }

    @Delete('remove-attribute/variant/:variantId/attribute/:attributeId')
    async removeAttribute(@Param('variantId') variantId: string, @Param('attributeId') attributeId: string) {
        return await this.variantsService.removeAttribute(variantId, attributeId);
    }

    @Delete('remove-color/variant/:variantId/color/:colorId')
    async removeColor(@Param('variantId') variantId: string, @Param('colorId') colorId: string) {
        return await this.variantsService.removeColor(variantId, colorId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.variantsService.remove(id);
    }
}
