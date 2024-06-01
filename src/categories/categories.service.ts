import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDocument } from './models/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        @InjectModel(CategoryDocument.name)
        private categoryModel: Model<CategoryDocument>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const response = await this.categoryRepository.create({
                ...createCategoryDto,
                parent_id: createCategoryDto.parent_id
                    ? new mongoose.Types.ObjectId(createCategoryDto.parent_id)
                    : null,
            });
            return response;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll() {
        return await this.categoryRepository.find({}, 'parent_id');
    }

    async findOne(_id: string) {
        return await this.categoryRepository.findOne({ _id }, 'parent_id');
    }

    async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
        return await this.categoryRepository.fundOneAndUpdate(
            { _id },
            updateCategoryDto,
        );
    }

    async remove(_id: string) {
        return await this.categoryRepository.findOneAndDelete({ _id });
    }
}
