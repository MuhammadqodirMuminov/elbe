import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantDocument } from './models/variant.schema';

@Injectable()
export class VariantsService {
    constructor(@InjectModel(VariantDocument.name) private readonly variantModel: Model<VariantDocument>) {}

    async create(createVariantDto: CreateVariantDto): Promise<VariantDocument> {
        try {
            const productvariant = await this.variantModel.create({ ...createVariantDto, _id: new Types.ObjectId() });
            return productvariant;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    findAll() {
        return `This action returns all variants`;
    }

    async findOne(id: string): Promise<VariantDocument> {
        const variant = await this.variantModel.findOne({ _id: id });
        if (!variant) throw new NotFoundException('Variant not found');
        return variant;
    }

    update(id: number, updateVariantDto: UpdateVariantDto) {
        return `This action updates a #${id} variant`;
    }

    remove(id: number) {
        return `This action removes a #${id} variant`;
    }
}
