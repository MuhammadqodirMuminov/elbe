import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import { BrandsService } from 'src/brands/brands.service';
import { CategoryRepository } from 'src/categories/category.repository';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionType } from 'src/common';
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
                sold_amount: 0,
            });

            return createdProduct;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll(query: QueryProductDto) {
        const { page = 1, limit = 10, search = '' } = query;
        const validatedFilterQuery = await this.validateFilterQuery(query);
        const queryFilter: Record<string, any> = {};

        if (query.categoryId && query.categoryId.length > 0) {
            queryFilter['category'] = { $in: (validatedFilterQuery.categoryId as string[]).map((c) => new Types.ObjectId(c)) };
        }

        if (query.minPrice && query.maxPrice) {
            queryFilter.price = { $gte: Number(query.minPrice), $lte: Number(query.maxPrice) };
        }

        if (query.brandId && query.brandId.length > 0) {
            queryFilter.brand = { $in: (validatedFilterQuery.brandId as string[]).map((b) => new Types.ObjectId(b)) };
        }

        if (query.size && query.size.length > 0) {
            queryFilter['variants.size'] = { $in: validatedFilterQuery.size };
        }

        if (query.search) {
            queryFilter['$or'] = [
                { name: new RegExp(query.search, 'i') },
                { description: new RegExp(query.search, 'i') },
                {
                    variants: {
                        $elemMatch: {
                            barcode: new RegExp(query.search, 'i'),
                        },
                    },
                },
            ];
        }

        const [data, total] = await Promise.all([
            await this.productModel
                .find(queryFilter)
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                    {
                        path: 'variants.images',
                        model: UploadDocuemnt.name,
                        select: { _id: 1, url: 1 },
                    },
                ])
                .exec(),
            await this.productModel.countDocuments(queryFilter).exec(),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
    }

    async createChildCategory(categoryId: string, query: QueryProductDto) {
        const { page = 1, limit = 10, search = '' } = query;
        const category = await this.categoryModel.findOne({ _id: categoryId, parent_id: { $ne: null } });

        if (!category) throw new BadRequestException('please select a child categpry');
        // update
        const products = await this.productModel
            .find({ category: category._id.toString() })
            .skip((+page - 1) * +limit)
            .limit(Number(limit))
            .populate([
                { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
            ])
            .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }])
            .exec();

        const total = await this.productModel.countDocuments({ category: category._id.toString() }).exec();

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

    async findOne(id: string): Promise<ProductDocument> {
        const product = await this.productModel.findById(id, {}, { populate: [{ path: 'category' }] }).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async findBestsellers() {
        try {
            const products = await this.productModel
                .find({}, {}, {})
                .sort({ sold_amount: -1 })
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                ])
                .populate([{ path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } }] }]);

            return products.slice(0, 4);
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

    async getAllWithQuery(filterQuery: FilterQuery<ProductDocument>, query?: QueryOptions<ProductDocument>) {
        return await this.productModel.find(filterQuery, {}, query).exec();
    }

    async getOneWithQuery(filterQuery: FilterQuery<ProductDocument>, query?: QueryOptions<ProductDocument>) {
        return await this.productModel.findOne(filterQuery, {}, query).exec();
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

    async updateWithQuery(filter: FilterQuery<ProductDocument>, update?: UpdateQuery<ProductDocument> | UpdateWithAggregationPipeline) {
        return await this.productModel.updateOne(filter, update);
    }

    async remove(id: string): Promise<any> {
        const product = await this.getOne(id);

        if (product.variants.length) {
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

    async getAllChildCategories(categoryIds: string[]): Promise<Types.ObjectId[]> {
        let allCategoryIds: Types.ObjectId[] = [];

        for (const categoryId of categoryIds) {
            const category = await this.categoryModel.findById(categoryId).exec();
            if (!category) throw new NotFoundException('category bot found');
            allCategoryIds.push(category._id);
        }

        return allCategoryIds;
    }

    async validateFilterQuery(query: QueryProductDto) {
        let validatedQuery: Partial<QueryProductDto> = { ...query };

        if (query.categoryId) {
            if (!Array.isArray(query.categoryId)) {
                validatedQuery.categoryId = [query.categoryId];
            }
        }

        if (query.brandId) {
            if (!Array.isArray(query.brandId)) {
                validatedQuery.brandId = [query.brandId];
            }
        }

        if (query.size) {
            if (!Array.isArray(query.size)) {
                validatedQuery.size = [query.size];
            }
        }

        if (query.color) {
            if (!Array.isArray(query.color)) {
                validatedQuery.color = [query.color];
            }
        }

        return validatedQuery;
    }
}
