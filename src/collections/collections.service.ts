import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BrandsService } from 'src/brands/brands.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CollectionType } from 'src/common';
import { UploadService } from 'src/upload/upload.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionDocument } from './models/collection.schema';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectModel(CollectionDocument.name) private readonly collectionModel: Model<CollectionDocument>,
        private readonly brandService: BrandsService,
        private readonly categoryService: CategoriesService,
        private readonly uploadService: UploadService,
    ) {}

    async create(createCollectionDto: CreateCollectionDto) {
        try {
            const data: Record<string, any> = { ...createCollectionDto };
            if (createCollectionDto.type === CollectionType.BRAND) {
                const brand = await this.brandService.findOne(createCollectionDto.brand);
                data.brand = brand._id;
            } else if (createCollectionDto.type === CollectionType.CATEGORY) {
                const category = await this.categoryService.findOne(createCollectionDto.category);
                data.category = category._id;
            }

            const image = await this.uploadService.findOne(createCollectionDto.image);
            data.image = image._id;

            return await this.collectionModel.create({ ...data, _id: new Types.ObjectId() });
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll() {
        return await this.collectionModel.find(
            {},
            {},
            {
                populate: [
                    {
                        path: 'brand',
                        populate: [{ path: 'logo', select: { _id: 1, url: 1 } }],
                    },
                    {
                        path: 'category',
                    },
                ],
            },
        );
    }

    async findOne(id: string) {
        const collection = await this.collectionModel.findOne(
            { _id: id },
            {},
            {
                populate: [
                    {
                        path: 'brand',
                        populate: [{ path: 'logo', select: { _id: 1, url: 1 } }],
                    },
                    {
                        path: 'category',
                    },
                ],
            },
        );
        if (!collection) throw new NotFoundException('Collection not found');
        return collection;
    }

    async update(id: string, body: UpdateCollectionDto) {
        try {
            const updateData: Record<string, any> = { ...body };

            if (body.brand) {
                const brand = await this.brandService.findOne(body.brand);
                updateData.brand = brand._id;
            }

            if (body.category) {
                const category = await this.categoryService.findOne(body.category);
                updateData.category = category._id;
            }

            if (body.image) {
                const image = await this.uploadService.findOne(body.image);
                updateData.image = image._id;
            }

            return await this.collectionModel.updateOne({ _id: id }, updateData);
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async remove(id: string) {
        const collection = await this.findOne(id);
        await this.uploadService.deleteMedia(collection.image.toString());
        await this.collectionModel.deleteOne({ _id: id });
    }
}
