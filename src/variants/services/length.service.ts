import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLengthDto } from '../dto/length/create.dto';
import { UpdateLengthDto } from '../dto/length/update.dto';
import { LengthDocument } from '../models/length.schema';

@Injectable()
export class LengthService {
    constructor(@InjectModel(LengthDocument.name) private readonly lengthModel: Model<LengthDocument>) {}

    // Create a new length
    async create(createLengthDto: CreateLengthDto): Promise<LengthDocument> {
        const createdLength = new this.lengthModel({ ...createLengthDto, _id: new Types.ObjectId() });
        return createdLength.save();
    }

    // Get a single length by ID
    async findOne(id: string): Promise<LengthDocument> {
        const length = await this.lengthModel.findById(id).exec();
        if (!length) {
            throw new NotFoundException(`Length with ID "${id}" not found`);
        }
        return length;
    }

    // Get all lengths
    async findAll(): Promise<LengthDocument[]> {
        return this.lengthModel.find().exec();
    }

    // Update a length by ID
    async update(id: string, updateLengthDto: UpdateLengthDto): Promise<LengthDocument> {
        const existingLength = await this.lengthModel.findByIdAndUpdate(id, updateLengthDto, { new: true }).exec();
        if (!existingLength) {
            throw new NotFoundException(`Length with ID "${id}" not found`);
        }
        return existingLength;
    }

    // Delete a length by ID
    async remove(id: string): Promise<void> {
        const result = await this.lengthModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Length with ID "${id}" not found`);
        }
    }
}
