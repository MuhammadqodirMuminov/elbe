// sizes.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductDocument } from 'src/products/models/product.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { CreateSizeDto } from '../dto/sizes/create.dto';
import { UpdateSizeDto } from '../dto/sizes/update.dto';
import { LengthDocument } from '../models/length.schema';
import { SizeGuideDocument } from '../models/size-guide.schema';
import { SizesDocument } from '../models/sizes.schema';
import { SizeGuideService } from './size-guide.service';

@Injectable()
export class SizesService {
    constructor(
        @InjectModel(SizesDocument.name) private sizesModel: Model<SizesDocument>,
        @InjectModel(ProductDocument.name) private productmodel: Model<ProductDocument>,
        private readonly categoryService: CategoriesService,
        private readonly sizeGuideService: SizeGuideService,
    ) {}

    async create(createSizeDto: CreateSizeDto): Promise<SizesDocument> {
        let sizeGuide: Types.ObjectId[] = [];
        const category = await this.categoryService.getOne(createSizeDto.category);

        if (category.parent_id !== null) {
            throw new BadRequestException('Only Parent category is supported');
        }

        if (createSizeDto.size_guide) {
            sizeGuide = await Promise.all(
                createSizeDto.size_guide.map(async (s) => {
                    return (await this.sizeGuideService.findOne(s))._id;
                }),
            );
        }

        const existCategory = await this.sizesModel.findOne({ category: category._id });

        if (existCategory) {
            throw new BadRequestException('Category already exists');
        }

        const newSize = new this.sizesModel({ ...createSizeDto, category: category._id, _id: new Types.ObjectId(), size_guide: sizeGuide });
        return newSize.save();
    }

    async findAll(): Promise<SizesDocument[]> {
        return this.sizesModel
            .find(
                {},
                {},
                {
                    populate: [
                        { path: 'category', select: { products: false }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                        {
                            path: 'size_guide',
                            model: SizeGuideDocument.name,
                            populate: [
                                {
                                    path: 'guide',
                                    select: { _id: 1, url: 1 },
                                    model: UploadDocuemnt.name,
                                },
                                {
                                    path: 'length',
                                    model: LengthDocument.name,
                                },
                            ],
                        },
                    ],
                },
            )
            .exec();
    }

    async findOne(id: string): Promise<SizesDocument> {
        const size = await this.sizesModel
            .findById(
                id,
                {},
                {
                    populate: [
                        { path: 'category', select: { products: false }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                        { path: 'size_guide', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                    ],
                },
            )
            .exec();
        if (!size) {
            throw new NotFoundException(`Size with ID ${id} not found`);
        }
        return size;
    }

    async getByProductId(productId: string) {
        const product = await this.productmodel.findOne({ _id: productId }, {}, { populate: [{ path: 'category' }] });

        const categoryId = (product.category as any).parent_id;

        const size = await this.sizesModel.findOne({ category: categoryId });
        return size ? size : {};
    }

    async update(id: string, updateSizeDto: UpdateSizeDto): Promise<SizesDocument> {
        await this.findOne(id);

        const updateBody: Record<string, any> = { ...updateSizeDto };

        if (updateSizeDto.category) {
            const category = await this.categoryService.getOne(updateSizeDto.category);
            if (category.parent_id) {
                throw new BadRequestException('Only Parent category is supported');
            }
            updateBody.category = category._id;
        }

        if (updateSizeDto.size_guide) {
            updateBody.size_guide = await Promise.all(
                updateSizeDto.size_guide.map(async (s) => {
                    return (await this.sizeGuideService.findOne(s))._id;
                }),
            );
        }

        const updatedSize = await this.sizesModel.findByIdAndUpdate(id, updateBody, { new: true }).exec();

        return updatedSize;
    }

    async remove(id: string): Promise<void> {
        const result = await this.sizesModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Size with ID ${id} not found`);
        }
    }
}
