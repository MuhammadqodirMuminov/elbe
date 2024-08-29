import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { ProductsService } from 'src/products/products.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { Abttribute, AddImageDto, CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateAttributeDto, UpdateVariantDto } from '../dto/update-variant.dto';
import { ColorDocument } from '../models/color.schema';
import { LengthDocument } from '../models/length.schema';
import { ColorService } from './color.service';
import { LengthService } from './length.service';

@Injectable()
export class VariantsService {
    constructor(
        @InjectModel(VariantDocument.name) private readonly variantModel: Model<VariantDocument>,
        @InjectModel(ProductDocument.name) private readonly productModel: Model<ProductDocument>,
        private readonly uploadService: UploadService,
        private readonly productsService: ProductsService,
        private readonly colorService: ColorService,
        private readonly lengthService: LengthService,
    ) {}

    // create a new variant
    async create(createVariantDto: CreateVariantDto): Promise<VariantDocument> {
        try {
            // convert all images to ObjectId
            const images = await Promise.all(
                createVariantDto?.images?.map(async (i: any) => {
                    await this.uploadService.findOne(i);
                    return new Types.ObjectId(i);
                }),
            );

            // get product by id
            const product = await this.productsService.getOne(createVariantDto.productId);

            // create variant document
            const productvariant = await this.variantModel.create({
                ...createVariantDto,
                productId: new Types.ObjectId(createVariantDto.productId),
                images: images,
                _id: new Types.ObjectId(),
                color: new Types.ObjectId(createVariantDto.color),
                length: new Types.ObjectId(createVariantDto.length),
            });

            // update product add new variantId to product.variants
            await this.productModel.updateOne({ _id: product._id }, { $push: { variants: productvariant._id } });

            return productvariant;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    // add images to the variant
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

    // add additional info to variant like: delivery info, fabric info
    async addAttribute(varantId: string, addAttributeDto: Abttribute) {
        const existVariant = await this.findOne(varantId);

        await this.variantModel.updateOne({ _id: existVariant._id }, { $push: { attributes: addAttributeDto } });

        return await this.findOne(varantId);
    }

    // get varinats by ProductId
    async getByProductId(productId: string) {
        try {
            const variants = await this.variantModel.find(
                { productId: new Types.ObjectId(productId) },
                { productId: 0 },
                {
                    populate: [
                        {
                            path: 'images',
                            select: { _id: 1, url: 1 },
                            model: UploadDocuemnt.name,
                        },
                        {
                            path: 'color',
                        },
                        {
                            path: 'length',
                            model: LengthDocument.name,
                        },
                    ],
                },
            );
            return variants;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    // get One variant by variantId
    async findOne(id: string): Promise<VariantDocument> {
        const variant = await this.variantModel.findOne(
            { _id: id },
            {},
            {
                populate: [
                    { path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name },
                    { path: 'productId', model: ProductDocument.name, select: { _id: 1, name: 1 } },
                    { path: 'color', model: ColorDocument.name, select: { _id: 1, title: 1, value: 1, value2: 1 } },
                    { path: 'length', model: LengthDocument.name, select: { _id: 1, key: 1, value: 1 } },
                ],
            },
        );
        if (!variant) throw new NotFoundException('Variant not found');

        return variant;
    }

    // update a variant with variantid and attributeId
    async updateAttribute(variantId: string, attributeId: string, body: UpdateAttributeDto) {
        // find the variant
        const variant = await this.findOne(variantId);

        // find the attributes and if not found throw an error
        const attr = variant.attributes.find((a: any) => a._id.toString() === attributeId);
        if (!attr) {
            throw new NotFoundException('Attribute is not found!');
        }

        // update variant attribute
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

    // update a variant with variantId
    async update(id: string, updateVariantDto: UpdateVariantDto) {
        try {
            const updatedData: Record<string, any> = { ...updateVariantDto };

            // find the variant
            const variant = await this.findOne(id);

            // update variant color
            if (updateVariantDto.color) {
                const color = await this.colorService.findOne(updateVariantDto.color);
                updatedData.color = color._id;
            }

            // update variant legnth
            if (updateVariantDto.length) {
                const legnth = await this.lengthService.findOne(updateVariantDto.length);
                updatedData.length = legnth._id;
            }

            // update the variant with updated body data
            const data = await this.variantModel.updateOne({ _id: id }, updatedData);

            return await this.findOne(id);
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    // remove a variant image with variantId and imageId
    async removeImage(variantId: string, imageId: string): Promise<void> {
        try {
            await this.findOne(variantId);
            await this.uploadService.deleteMedia(imageId);
            await this.variantModel.updateOne({ _id: variantId }, { $pull: { images: new Types.ObjectId(imageId) } });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }

    // remove a variant attribute with variantId and attributeId
    async removeAttribute(varantId: string, attributeId: string) {
        const variant = await this.findOne(varantId);

        await this.variantModel.updateOne({ _id: variant._id }, { $pull: { attributes: { _id: new Types.ObjectId(attributeId) } } });

        return await this.findOne(varantId);
    }

    // remove a variant with variantId
    async remove(id: string) {
        try {
            // find the variant
            const variant = await this.findOne(id);

            // remove the variant image
            if (variant.images.length !== 0) {
                await Promise.all(
                    variant.images.map(async (i) => {
                        await this.uploadService.deleteMedia(i._id.toString());
                    }),
                );
            }

            // remove variand from product
            await this.productModel.updateOne({ _id: variant.productId }, { $pull: { variants: new Types.ObjectId(variant._id) } });

            // remove the variant from db
            await this.variantModel.deleteOne({ _id: variant._id });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server error', error?.status || 500);
        }
    }
}
