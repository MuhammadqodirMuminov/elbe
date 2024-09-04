// size-guide.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';
import { CreateSizeGuideDto } from '../dto/size-guide/create.dto';
import { UpdateSizeGuideDto } from '../dto/size-guide/update.dto';
import { SizeGuideDocument } from '../models/size-guide.schema';
import { LengthService } from './length.service';

@Injectable()
export class SizeGuideService {
    constructor(
        @InjectModel(SizeGuideDocument.name) private sizeGuideModel: Model<SizeGuideDocument>,
        private readonly lengthService: LengthService,
        private readonly uploadService: UploadService,
    ) {}

    async create(createSizeGuideDto: CreateSizeGuideDto): Promise<SizeGuideDocument> {
        const length = await this.lengthService.findOne(createSizeGuideDto.length);
        const guide = await this.uploadService.findOne(createSizeGuideDto.guide);
        const newSizeGuide = new this.sizeGuideModel({ length: length._id, description: createSizeGuideDto.description, guide: guide._id, _id: new Types.ObjectId() });
        return newSizeGuide.save();
    }

    async findAll(): Promise<SizeGuideDocument[]> {
        return this.sizeGuideModel
            .find(
                {},
                {},
                {
                    populate: [
                        {
                            path: 'length',
                        },
                        {
                            path: 'guide',
                        },
                    ],
                },
            )
            .exec();
    }

    async findOne(id: string): Promise<SizeGuideDocument> {
        const sizeGuide = await this.sizeGuideModel
            .findById(id)
            .populate([
                {
                    path: 'length',
                },
                {
                    path: 'guide',
                },
            ])
            .exec();
        if (!sizeGuide) {
            throw new NotFoundException(`Size Guide with ID ${id} not found`);
        }
        return sizeGuide;
    }

    async update(id: string, updateSizeGuideDto: UpdateSizeGuideDto): Promise<SizeGuideDocument> {
        const sizeGuide = await this.findOne(id);

        const updatedBody: Record<string, any> = { ...updateSizeGuideDto };
        if (updateSizeGuideDto.length) {
            const length = await this.lengthService.findOne(updateSizeGuideDto.length);
            updatedBody.length = length._id;
        }

        if (updatedBody.guide) {
            const guide = await this.uploadService.findOne(updateSizeGuideDto.guide);
            updatedBody.guide = guide._id;
            await this.uploadService.deleteMedia(sizeGuide._id.toString());
        }

        const updatedSizeGuide = await this.sizeGuideModel.findByIdAndUpdate(id, updatedBody, { new: true }).exec();

        return updatedSizeGuide;
    }

    async remove(id: string): Promise<void> {
        const result = await this.sizeGuideModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Size Guide with ID ${id} not found`);
        }
    }
}
