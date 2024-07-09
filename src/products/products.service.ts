import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BrandsService } from 'src/brands/brands.service';
import { CategoryRepository } from 'src/categories/category.repository';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionType } from 'src/common';
import { OrdersService } from 'src/orders/orders.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { VariantsService } from 'src/variants/variants.service';
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
        @Inject(forwardRef(() => VariantsService)) private readonly variantService: VariantsService,
        private readonly orderService: OrdersService,
        private readonly brandService: BrandsService,
        private readonly collectionService: CollectionsService,
    ) {}

    async create(body: CreateProductDto): Promise<ProductDocument> {
        try {
            await this.categoryRepository.findOne({ _id: body.category });

            await this.brandService.findOne(body.brand.toString());

            const images = (await this.uploadService.findOne(body.image.toString()))._id;

            const createdProduct = await this.productRepository.create({
                ...body,
                category: new Types.ObjectId(body.category),
                brand: new Types.ObjectId(body.brand),
                image: images,
                variants: [],
            });

            return createdProduct;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll(query: QueryProductDto) {
        const { page = 1, limit = 10, search = '' } = query;
        const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] } : {};

        const [data, total] = await Promise.all([
            await this.productModel
                .find(filter)
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                ])
                .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }])
                .exec(),
            await this.productModel.countDocuments(filter).exec(),
        ]);

        return { data: data, total, page, limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
    }

    async createChildCategory(categoryId: string, query: QueryProductDto) {
        const { page = 1, limit = 10, search = '' } = query;
        const category = await this.categoryModel.findOne({ _id: categoryId, parent_id: { $ne: null } });
        if (!category) throw new BadRequestException('please select a child categpry');

        const products = await this.productModel
            .find({ category: category._id, $or: [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] })
            .skip((+page - 1) * +limit)
            .limit(Number(limit))
            .populate([
                { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
            ])
            .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }])
            .exec();

        const total = await this.productModel.countDocuments({ category: category._id }).exec();

        return { data: products, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
    }

    async getByCollection(collectionId: string, query: QueryProductDto) {
        let total: number;
        let products: ProductDocument[];
        const { page = 1, limit = 10, search = '' } = query;

        const collection = await this.collectionService.findOne(collectionId);

        if (collection.type === CollectionType.BRAND) {
            products = await this.productModel
                .find({ brand: new Types.ObjectId(collection.brand) })
                .find()
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                ])
                .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }])
                .exec();

            total = await this.productModel.countDocuments({ brand: new Types.ObjectId(collection.brand) }).exec();
        } else if (collection.type === CollectionType.CATEGORY) {
            products = await this.productModel
                .find({ category: new Types.ObjectId(collection.category) })
                .find()
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                ])
                .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }])
                .exec();
            total = await this.productModel.countDocuments({ category: new Types.ObjectId(collection.category) }).exec();
        }

        return { data: products, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
    }

    async findOne(id: string): Promise<any> {
        const product = await this.productModel.findById(id, {}, { populate: [{ path: 'category' }] }).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async findBestsellers() {
        try {
            const productSales = new Map<string, number>();

            const orders = await this.orderService.findAll();

            if (orders.length === 0) {
                orders?.forEach(async (order) => {
                    order.products.forEach((p) => {
                        const count = productSales.get(p?.productId?.toString()) || 0;
                        productSales.set(p.productId.toString(), count + 1);
                    });
                });
            } else {
                const products = await this.productModel.find();
                products.slice(0, 100).forEach((p) => {
                    const count = productSales.get(p?._id?.toString()) || 0;
                    productSales.set(p._id.toString(), count + 1);
                });
            }

            const sortedProducts = Array.from(productSales.entries()).sort((a, b) => b[1] - a[1]);
            const bestSellerIds = sortedProducts.slice(0, 4).map((entry) => entry[0]);

            return this.productModel
                .find({ _id: { $in: bestSellerIds } }, {}, {})
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                ])
                .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }]);
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getOne(id: string): Promise<ProductDocument> {
        const product = await this.productModel.findById(id, {}).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async getAllWithQuery(filterQuery: FilterQuery<ProductDocument>) {
        return await this.productModel.find(filterQuery).exec();
    }

    async detail(id: string) {
        const product = await this.productModel
            .findById(
                id,
                {},
                {
                    populate: [
                        { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                        { path: 'image', select: { _id: 1, url: 1 } },
                        { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                        { path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] },
                    ],
                },
            )
            .exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const recomended = await this.productModel.find({ category: product.category._id }).populate([
            { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
            { path: 'image', select: { _id: 1, url: 1 } },
            { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
            { path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] },
        ]);

        return { product, recomendations: recomended.slice(0, 8) };
    }

    async update(id: string, body: UpdateProductDto): Promise<ProductDocument> {
        const product = await this.getOne(id);

        const updatedData: Record<string, any> = { ...body };

        if (body.category) {
            const category = await this.categoryRepository.findOne({ _id: body.category });
            updatedData.category = category._id;
        }

        if (body.brand) {
            const brand = await this.brandService.findOne(body.brand.toString());
            updatedData.brand = brand._id;
        }

        if (body.image) {
            const images = (await this.uploadService.findOne(body.image.toString()))._id;
            updatedData.image = images;
            await this.uploadService.deleteMedia(product.image.toString());
        }

        const updatedProduct = await this.productModel.findByIdAndUpdate(id, body, { new: true }).exec();

        return updatedProduct;
    }

    async remove(id: string): Promise<any> {
        const product = await this.getOne(id);
        if (product.variants.length !== 0) {
            await Promise.all(
                product.variants.map(async (v) => {
                    await this.variantService.remove(v._id.toString());
                }),
            );
        }

        await this.uploadService.deleteMedia(product.image.toString());

        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

        return deletedProduct;
    }
}
