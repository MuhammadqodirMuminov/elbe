import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Abttribute, AddImageDto, CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateAttributeDto, UpdateVariantDto } from '../dto/update-variant.dto';
import { VariantsService } from '../services/variants.service';

@ApiTags('variants')
@Controller('variants')
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) {}

    // create a new variant
    @Post()
    async create(@Body() createVariantDto: CreateVariantDto) {
        return await this.variantsService.create(createVariantDto);
    }

    // add images to the variant
    @Post('add-image/:id')
    async addImage(@Param('id') variantId: string, @Body() addImageDto: AddImageDto) {
        return await this.variantsService.addImage(variantId, addImageDto);
    }

    // add additional info to variant like: delivery info, fabric info
    @Post('add-attribute/:id')
    async addAttribute(@Param('id') variantId: string, @Body() addAttributeDto: Abttribute) {
        return await this.variantsService.addAttribute(variantId, addAttributeDto);
    }

    // get variants by productId
    @Get('product/:productId')
    async getByProductId(@Param('productId') productId: string) {
        return await this.variantsService.getByProductId(productId);
    }

    // get One variant by variantId
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.variantsService.findOne(id);
    }

    // update a variant with variantid and attributeId
    @Patch('update-attribute/variant/:varianId/attribute/:attributeId')
    async updateAttribute(@Param('varianId') varianId: string, @Param('attributeId') attributeId: string, @Body() body: UpdateAttributeDto) {
        return await this.variantsService.updateAttribute(varianId, attributeId, body);
    }

    // update a variant with variantId
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
        return this.variantsService.update(id, updateVariantDto);
    }

    // remove a variant image with variantId and imageId
    @Delete('remove-image/variant/:variantId/image/:imageId')
    async removeImage(@Param('variantId') variantId: string, @Param('imageId') imageId: string) {
        return await this.variantsService.removeImage(variantId, imageId);
    }

    // remove a variant attribute with variantId and attributeId
    @Delete('remove-attribute/variant/:variantId/attribute/:attributeId')
    async removeAttribute(@Param('variantId') variantId: string, @Param('attributeId') attributeId: string) {
        return await this.variantsService.removeAttribute(variantId, attributeId);
    }

    // remove the variant with varianId
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.variantsService.remove(id);
    }
}
