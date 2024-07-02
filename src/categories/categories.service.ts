import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
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
        @InjectModel(ProductDocument.name)
        private readonly productModel: Model<ProductDocument>,
        private readonly uploadService: UploadService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const file = await this.uploadService.findOne(createCategoryDto.image);

            const response = await this.categoryRepository.create({
                ...createCategoryDto,
                parent_id: createCategoryDto.parent_id ? new mongoose.Types.ObjectId(createCategoryDto.parent_id) : null,
                image: file._id,
            });
            return response;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll() {
        const categories = await this.categoryModel.find({}, {}, { populate: [{ path: 'products', model: ProductDocument.name, populate: [{ path: 'image', model: UploadDocuemnt.name }] }, { path: 'image' }, { path: 'parent_id', model: CategoryDocument.name, select: { products: 0 } }] });

        return categories;
    }

    async findOne(_id: string) {
        const category = await this.categoryRepository.findOne({ _id }, ['parent_id', 'image']);
        return await this.categoryModel.populate(category, { path: 'products', model: ProductDocument.name });
    }

    async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
        const existCategory = await this.categoryModel.findOne({ _id, isActive: true });

        if (!existCategory) throw new NotFoundException('Category not found');

        let updatedData: Record<string, any> = { ...updateCategoryDto };

        if (updateCategoryDto.image) {
            const file = await this.uploadService.findOne(updateCategoryDto.image);
            updatedData.image = file._id;

            await this.uploadService.deleteMedia(existCategory.image.toString());
        }

        return await this.categoryRepository.fundOneAndUpdate({ _id }, updateCategoryDto);
    }

    async remove(_id: string) {
        const category = await this.validateId(_id);

        await this.categoryRepository.findOneAndDelete({ _id });
        await this.uploadService.deleteMedia(category.image.toString());
    }

    async validateId(_id: string): Promise<CategoryDocument> {
        const existCategory = await this.categoryModel.findOne({ _id, isActive: true });

        if (!existCategory) throw new NotFoundException('Category not found');
        return existCategory;
    }
}
