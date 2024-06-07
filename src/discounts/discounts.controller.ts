// src/discount/discount.controller.ts

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './models/discount.schema';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) {}

    @Post()
    async create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
        return this.discountService.create(createDiscountDto);
    }

    @Get()
    async findAll(): Promise<Discount[]> {
        return this.discountService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Discount> {
        return this.discountService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
        return this.discountService.update(id, updateDiscountDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Discount> {
        return this.discountService.delete(id);
    }
}
