import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
    async findAll(@Query() query: QueryProductDto) {
        return await this.productsService.findAll(query);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('with-wishlists')
    async withWishlists(@Query() query: QueryProductDto, @CurrentUser() user: UserDocument) {
        return await this.productsService.findAll(query, user);
    }

    @Get('get-by-collection/:collectionId')
    async getByCollection(@Param('collectionId') collectionId: string, @Query() query: QueryProductDto) {
        return await this.productsService.getByCollection(collectionId, query);
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
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productsService.update(id, updateProductDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productsService.remove(id);
    }
}
