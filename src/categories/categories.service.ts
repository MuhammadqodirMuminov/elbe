import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { VariantDocument } from 'src/variants/models/variant.schema';
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

    async getAllParents() {
        try {
            const parents = await this.categoryModel.find(
                { parent_id: null, isActive: true },
                { products: 0 },
                {
                    populate: [{ path: 'image', select: { _id: 1, url: 1 } }],
                },
            );

            return await Promise.all(
                parents.map(async (p) => {
                    const c = JSON.parse(JSON.stringify(p));

                    const childs = await this.categoryModel.find({ parent_id: new Types.ObjectId(p._id) }, { parent_id: 0, products: 0 }, { populate: [{ path: 'image', select: { _id: 1, url: 1 } }] }).exec();

                    return { ...c, childs };
                }),
            );
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getChildByParentId(parentId: string) {
        try {
            const childs = await this.categoryModel.find({ parent_id: new Types.ObjectId(parentId) }, { parent_id: 0 }, { populate: [{ path: 'image', select: { _id: 1, url: 1 } }] }).exec();

            return await Promise.all(
                childs.map(async (child) => {
                    const c = JSON.parse(JSON.stringify(child));

                    const products = await this.productModel.find(
                        { category: new Types.ObjectId(child._id) },
                        {},
                        {
                            populate: [
                                { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                                { path: 'image', select: { _id: 1, url: 1 } },
                                { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                                { path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] },
                            ],
                        },
                    );

                    return { ...c, products };
                }),
            );
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll() {
        const categories = await this.categoryModel.find(
            {},
            {},
            {
                populate: [
                    {
                        path: 'products',
                        model: ProductDocument.name,
                        populate: [
                            { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                            { path: 'image', model: UploadDocuemnt.name },
                        ],
                    },
                    { path: 'image' },
                    { path: 'parent_id', model: CategoryDocument.name, select: { products: 0 } },
                ],
            },
        );

        return categories;
    }

    async findOne(_id: string) {
        const category = await this.categoryModel.findOne(
            { _id },
            {},
            {
                populate: [
                    { path: 'parent_id', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'image', select: { _id: 1, url: 1 } },
                ],
            },
        );

        const products = await this.productModel.find({ category: new Types.ObjectId(category._id) });

        return { ...JSON.parse(JSON.stringify(category)), products: products };
    }

    async getOne(id: string) {
        const category = await this.categoryModel.findOne({ _id: id });

        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
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

    async isChildCategory(id: string): Promise<boolean> {
        const category = await this.getOne(id);
        if (category.parent_id !== null) {
            return true;
        }
        return false;
    }
}
