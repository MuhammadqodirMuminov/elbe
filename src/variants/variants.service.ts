import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { ProductsService } from 'src/products/products.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { Abttribute, AddImageDto, ColorAttribute, CreateVariantDto } from './dto/create-variant.dto';
import { UpdateAttributeDto, UpdateColorDto, UpdateVariantDto } from './dto/update-variant.dto';

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

            await this.productModel.updateOne({ _id: product._id }, { $push: { variants: productvariant } });

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
        const variant = await this.variantModel.findOne(
            { _id: id },
            {},
            {
                populate: [
                    { path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name },
                    { path: 'productId', model: ProductDocument.name, select: { _id: 1, name: 1 } },
                ],
            },
        );
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

    async addAttribute(varantId: string, addAttributeDto: Abttribute) {
        const existVariant = await this.findOne(varantId);

        await this.variantModel.updateOne({ _id: existVariant._id }, { $push: { attributes: addAttributeDto } });

        return await this.findOne(varantId);
    }

    async removeAttribute(varantId: string, attributeId: string) {
        const variant = await this.findOne(varantId);

        await this.variantModel.updateOne({ _id: variant._id }, { $pull: { attributes: { _id: new Types.ObjectId(attributeId) } } });

        return await this.findOne(varantId);
    }

    async updateAttribute(variantId: string, attributeId: string, body: UpdateAttributeDto) {
        const variant = await this.findOne(variantId);

        const attr = variant.attributes.find((a: any) => a._id.toString() === attributeId);
        if (!attr) {
            throw new NotFoundException('Attribute is not found!');
        }

        await this.variantModel.updateOne(
            { _id: variant._id, 'attributes._id': new Types.ObjectId(attributeId) },
            {
                $set: {
                    'attributes.$.title': body.title,
                    'attributes.$.priority': body.priority,
                    'attributes.$.value': body.value,
                },
            },
        );

        return await this.findOne(variantId);
    }

    async addColor(variantId: string, body: ColorAttribute) {
        const variant = await this.findOne(variantId);

        await this.variantModel.updateOne({ _id: variant._id }, { $push: { color: body } });

        return await this.findOne(variantId);
    }

    async updateColor(variantId: string, colorId: string, updateColorDto: UpdateColorDto) {
        await this.validateVariant(variantId, colorId);

        await this.variantModel.updateOne(
            { _id: variantId, 'color._id': new Types.ObjectId(colorId) },
            {
                $set: {
                    'color.$.title': updateColorDto.title,
                    'color.$.priority': updateColorDto.priority,
                    'color.$.value': updateColorDto.value,
                },
            },
        );

        return await this.findOne(variantId);
    }

    async removeColor(variantId: string, colorId: string) {
        await this.validateVariant(variantId, colorId);

        await this.variantModel.updateOne({ _id: variantId }, { $pull: { color: { _id: new Types.ObjectId(colorId) } } });

        return await this.findOne(variantId);
    }

    protected async validateVariant(variantId: string, colorId: string): Promise<void> {
        const variant = await this.findOne(variantId);

        const color = variant?.color?.find((c: any) => c._id.toString() === colorId);
        if (!color) throw new NotFoundException('color not found!');
    }
}
