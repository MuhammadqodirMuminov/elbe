import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateColorDto } from '../dto/color/create.dto';
import { UpdateColorDto } from '../dto/color/update.dto';
import { ColorDocument } from '../models/color.schema';

@Injectable()
export class ColorService {
    constructor(@InjectModel(ColorDocument.name) private readonly colorModel: Model<ColorDocument>) {}

    // Create a new color
    async create(createColorDto: CreateColorDto): Promise<ColorDocument> {
        const createdColor = new this.colorModel({ ...createColorDto, _id: new Types.ObjectId() });
        return createdColor.save();
    }

    // Get all colors
    async findAll(): Promise<ColorDocument[]> {
        return this.colorModel.find().exec();
    }

    // Get a single color by ID
    async findOne(id: string): Promise<ColorDocument> {
        const color = await this.colorModel.findById(id).exec();
        if (!color) {
            throw new NotFoundException(`Color with ID "${id}" not found`);
        }
        return color;
    }

    // Update a color by ID
    async update(id: string, updateColorDto: UpdateColorDto): Promise<ColorDocument> {
        const existingColor = await this.colorModel.findByIdAndUpdate(id, updateColorDto, { new: true }).exec();
        if (!existingColor) {
            throw new NotFoundException(`Color with ID "${id}" not found`);
        }
        return existingColor;
    }

    // Delete a color by ID
    async remove(id: string): Promise<void> {
        const result = await this.colorModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Color with ID "${id}" not found`);
        }
    }
}
