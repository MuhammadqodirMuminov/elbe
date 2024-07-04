import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(@Query() query: QueryProductDto) {
        return this.productsService.findAll(query);
    }

    @Get('best-sellers')
    async findBestsellers() {
        return await this.productsService.findBestsellers();
    }

    @Get('child-category/:categoryId')
    async getChildCategory(@Param('categoryId') categoryId: string, @Query() query: QueryProductDto) {
        return await this.productsService.createChildCategory(categoryId, query);
    }

    @Get('detail/:id')
    async detail(@Param('id') id: string) {
        return await this.productsService.detail(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productsService.remove(id);
    }
}
