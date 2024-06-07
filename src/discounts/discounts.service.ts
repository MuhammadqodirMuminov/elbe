// src/discount/discount.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './models/discount.schema';

@Injectable()
export class DiscountService {
    constructor(@InjectModel(Discount.name) private discountModel: Model<Discount>) {}

    async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
        const createdDiscount = new this.discountModel(createDiscountDto);
        return createdDiscount.save();
    }

    async findAll(): Promise<Discount[]> {
        return this.discountModel.find().populate('applicableProducts', {}, ProductDocument.name).exec();
    }

    async findOne(id: string): Promise<Discount> {
        return this.discountModel.findById(id).populate('applicableProducts', {}, ProductDocument.name).exec();
    }

    async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
        return this.discountModel.findByIdAndUpdate(id, updateDiscountDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Discount> {
        return this.discountModel.findByIdAndDelete(id).exec();
    }
}
