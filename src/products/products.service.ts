import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryRepository } from 'src/categories/category.repository';
import { CategoryDocument } from 'src/categories/models/category.schema';
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
    ) {}

    async create(body: CreateProductDto): Promise<ProductDocument> {
        try {
            const category = await this.categoryRepository.findOne({ _id: body.category });

            const createdProduct = await this.productRepository.create({
                ...body,
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
                .populate(['category', 'reviews'])
                .exec(),
            await this.productModel.countDocuments(filter).exec(),
        ]);

        return { data: data, total };
    }

    async findOne(id: string): Promise<ProductDocument> {
        const product = await this.productModel.findById(id, {}, { populate: ['category', 'reviews'] }).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async update(id: string, body: UpdateProductDto): Promise<ProductDocument> {
        if (body.category) {
            await this.categoryRepository.findOne({ _id: body.category });
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
