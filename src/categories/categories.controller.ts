import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoriesService.create(createCategoryDto);
    }

    @Get('get-all-parents')
    async getAllParents() {
        return await this.categoriesService.getAllParents();
    }

    @Get('children/:parentId')
    async getChildByParentId(@Param('parentId') parentId: string) {
        return await this.categoriesService.getChildByParentId(parentId);
    }

    @Get()
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.categoriesService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return await this.categoriesService.update(id, updateCategoryDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.categoriesService.remove(id);
    }
}
