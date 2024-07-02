import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { ProductsService } from 'src/products/products.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { AddImageDto, CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantDocument } from './models/variant.schema';

@Injectable()
export class VariantsService {
    constructor(
        @InjectModel(VariantDocument.name) private readonly variantModel: Model<VariantDocument>,
        @InjectModel(ProductDocument.name) private readonly productModel: Model<ProductDocument>,
        private readonly uploadService: UploadService,
        private readonly productsService: ProductsService,
    ) {}

    async create(createVariantDto: CreateVariantDto): Promise<VariantDocument> {
        try {
            const images = await Promise.all(
                createVariantDto?.images?.map(async (i: any) => {
                    await this.uploadService.findOne(i);
                    return new Types.ObjectId(i);
                }),
            );

            const product = await this.productsService.getOne(createVariantDto.productId);

            const productvariant = await this.variantModel.create({ ...createVariantDto, productId: new Types.ObjectId(createVariantDto.productId), images: images, _id: new Types.ObjectId() });

            await this.productModel.updateOne({ _id: product._id }, { $push: { variants: productvariant._id } });

            return productvariant;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    async getByProductId(productId: string) {
        try {
            const variants = await this.variantModel.find({ productId: new Types.ObjectId(productId) }, { productId: 0 }, { populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] });
            return variants;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    async findOne(id: string): Promise<VariantDocument> {
        const variant = await this.variantModel.findOne({ _id: id }, { productId: 0 }, { populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] });
        if (!variant) throw new NotFoundException('Variant not found');
        return variant;
    }

    async update(id: string, updateVariantDto: UpdateVariantDto) {
        try {
            const updatedData: Record<string, any> = { ...updateVariantDto };

            const variant = await this.findOne(id);

            if (updateVariantDto.productId) {
                await this.productsService.getOne(updateVariantDto.productId);
                await this.productModel.updateOne({ _id: updateVariantDto.productId }, { $push: { variants: variant._id } });
                await this.productModel.updateOne({ _id: variant.productId }, { $pull: { variants: variant._id } });
                updatedData.productId = new Types.ObjectId(updateVariantDto.productId);
            }
            const data = await this.variantModel.updateOne({ _id: id }, updatedData);
            return data;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    async addImage(id: string, addImageDto: AddImageDto) {
        try {
            const variant = await this.findOne(id);
            await Promise.all(
                addImageDto.images.map(async (i) => {
                    await this.uploadService.findOne(i);
                    await this.variantModel.updateOne({ _id: id }, { $push: { images: new Types.ObjectId(i) } });
                }),
            );
            return { message: 'updated variant' };
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    async removeImage(variantId: string, imageId: string): Promise<void> {
        try {
            await this.findOne(variantId);
            await this.uploadService.deleteMedia(imageId);
            await this.variantModel.updateOne({ _id: variantId }, { $pull: { images: new Types.ObjectId(imageId) } });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    async remove(id: string) {
        try {
            const variant = await this.findOne(id);

            if (variant.images.length !== 0) {
                await Promise.all(
                    variant.images.map(async (i) => {
                        await this.uploadService.deleteMedia(i._id.toString());
                    }),
                );
            }

            await this.productModel.updateOne({ _id: variant.productId }, { $pull: { variants: variant._id } });

            await this.variantModel.deleteOne({ _id: variant._id });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }
}
