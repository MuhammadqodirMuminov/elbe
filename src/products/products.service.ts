import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryRepository } from 'src/categories/category.repository';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './models/product.schema';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(ProductDocument.name) private productModel: Model<ProductDocument>,
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        @InjectModel(CategoryDocument.name) private categoryModel: Model<CategoryDocument>,
        private readonly uploadService: UploadService,
    ) {}

    async create(body: CreateProductDto): Promise<ProductDocument> {
        try {
            const category = await this.categoryRepository.findOne({ _id: body.category });

            const images = Promise.all(
                body.images.map(async (image) => {
                    return (await this.uploadService.findOne(image.toString()))._id;
                }),
            );

            const createdProduct = await this.productRepository.create({
                ...body,
                category: new Types.ObjectId(body.category),
                images: await images,
            });

            await this.categoryModel.updateOne({ _id: category._id }, { $push: { products: createdProduct._id } });

            return createdProduct;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll(query: QueryProductDto): Promise<{ data: ProductDocument[]; total: number }> {
        const { page = 1, limit = 10, search = '' } = query;
        const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] } : {};

        const [data, total] = await Promise.all([
            await this.productModel
                .find(filter)
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate(['category', { path: 'images', model: UploadDocuemnt.name }, 'reviews'])
                .exec(),
            await this.productModel.countDocuments(filter).exec(),
        ]);

        return { data: data, total };
    }

    async findOne(id: string): Promise<any> {
        const product = await this.productModel.findById(id, {}, { populate: [{ path: 'category' }, { path: 'images', model: UploadDocuemnt.name }] }).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const recomended = await this.productModel.find({ category: product.category._id }).populate(['category', { path: 'images', model: UploadDocuemnt.name }, 'reviews']);

        return { product, recomendations: recomended.slice(0, 8) };
    }

    async update(id: string, body: UpdateProductDto): Promise<ProductDocument> {
        const updatedData: Record<string, any> = { ...body };

        if (body.category) {
            const category = await this.categoryRepository.findOne({ _id: body.category });
            updatedData.category = category._id;
        }

        if (body.images) {
            const images = Promise.all(
                body.images.map(async (image) => {
                    return (await this.uploadService.findOne(image.toString()))._id;
                }),
            );
            updatedData.images = await images;
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(id, body, { new: true }).exec();
        if (!updatedProduct) {
            throw new NotFoundException('Product not found');
        }
        return updatedProduct;
    }

    async remove(id: string): Promise<any> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
        return deletedProduct;
    }
}
