import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import { BrandsService } from 'src/brands/brands.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryRepository } from 'src/categories/category.repository';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionType, ProductSortTypes } from 'src/common';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { UploadService } from 'src/upload/upload.service';
import { LengthDocument } from 'src/variants/models/length.schema';
import { SizesDocument } from 'src/variants/models/sizes.schema';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { VariantsService } from 'src/variants/services/variants.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './models/product.schema';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(ProductDocument.name) private productModel: Model<ProductDocument>,
        @InjectModel(VariantDocument.name) private variantModel: Model<VariantDocument>,
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        @InjectModel(CategoryDocument.name) private categoryModel: Model<CategoryDocument>,
        private readonly uploadService: UploadService,
        @Inject(forwardRef(() => VariantsService)) private readonly variantService: VariantsService,
        private readonly brandService: BrandsService,
        private readonly collectionService: CollectionsService,
        private readonly categoryService: CategoriesService,
    ) {}

    // this is create a new ProductDocument
    async create(body: CreateProductDto): Promise<ProductDocument> {
        try {
            // find the category
            await this.categoryRepository.findOne({ _id: body.category });

            // find the brand
            const brand = await this.brandService.findOne(body.brand.toString());

            // find the image
            const images = (await this.uploadService.findOne(body.image.toString()))._id;

            // create the new product document and save it to the database
            const createdProduct = await this.productRepository.create({
                ...body,
                category: new Types.ObjectId(body.category),
                brand: brand._id,
                image: images,
                variants: [],
                sold_amount: 0,
            });

            return createdProduct;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    private generateSortData(sortBy: ProductSortTypes): Record<string, any> {
        let sort: Record<string, any> = { createdAt: -1 };

        switch (sortBy) {
            case ProductSortTypes.CHEAPEST:
                sort = { price: 1 };
                break;
            case ProductSortTypes.EXPENSIVE:
                sort = { price: -1 };
                break;
            case ProductSortTypes.BESTSELLERS:
                sort = { sold_amount: -1 };
                break;
            case ProductSortTypes.OFFERS:
                sort = { isOnOffer: -1, price: 1 };
                break;
            case ProductSortTypes.NEWEST:
            default:
                sort = { createdAt: -1 };
                break;
        }
        return sort;
    }

    async findAllWithSizeAndColor(query: QueryProductDto) {
        const { page = 1, limit = 10, sortBy } = query;
        const sort = this.generateSortData(sortBy);
        const queryFilter = await this.createProductsFilterQuery(query);

        const variantIds = (await this.variantModel.find(queryFilter)).map((v) => v._id);

        const productFilter = {};

        if (queryFilter.category) {
            productFilter['category'] = queryFilter.category;
        } else if (queryFilter.brand) {
            productFilter['brand'] = queryFilter.brand;
        } else {
            productFilter['variants'] = { $in: variantIds };
        }

        const [data, total] = await Promise.all([
            await this.productModel
                .find(productFilter)
                .sort(sort)
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },
                    {
                        path: 'variants',
                        model: VariantDocument.name,
                        populate: [
                            {
                                path: 'color',
                                select: { _id: 1, title: 1, value: 1, value2: 1 },
                            },
                            {
                                path: 'images',
                                model: UploadDocuemnt.name,
                                select: { _id: 1, url: 1 },
                            },
                            {
                                path: 'length',
                                model: LengthDocument.name,
                            },
                            {
                                path: 'size',
                                model: SizesDocument.name,
                                populate: [{ path: 'size_guide', model: UploadDocuemnt.name }],
                            },
                        ],
                    },
                ])
                .exec(),
            await this.productModel.countDocuments(queryFilter).exec(),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
    }

    async findAll(query: QueryProductDto) {
        const { page = 1, limit = 10, sortBy } = query;
        const sort = this.generateSortData(sortBy);
        if (query.size || query.color) {
            return await this.findAllWithSizeAndColor(query);
        }

        const queryFilter = await this.createProductsFilterQuery(query);

        const [data, total] = await Promise.all([
            await this.productModel
                .find(queryFilter)
                .sort(sort)
                .skip((+page - 1) * +limit)
                .limit(Number(limit))
                .populate([
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'image', model: UploadDocuemnt.name, select: { _id: 1, url: 1 } },

                    {
                        path: 'variants',
                        model: VariantDocument.name,
                        populate: [
                            {
                                path: 'color',
                                select: { _id: 1, title: 1, value: 1, value2: 1 },
                            },
                            {
                                path: 'images',
                                model: UploadDocuemnt.name,
                                select: { _id: 1, url: 1 },
                            },
                            {
                                path: 'length',
                                model: LengthDocument.name,
                            },
                            {
                                path: 'size',
                                model: SizesDocument.name,
                                populate: [{ path: 'size_guide', model: UploadDocuemnt.name }],
                            },
                        ],
                    },
                ])
                .exec(),
            await this.productModel.countDocuments(queryFilter).exec(),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
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
                    {
                        path: 'variants',
                        model: VariantDocument.name,
                        populate: [
                            {
                                path: 'color',
                                select: { _id: 1, title: 1, value: 1, value2: 1 },
                            },
                            {
                                path: 'images',
                                model: UploadDocuemnt.name,
                                select: { _id: 1, url: 1 },
                            },
                            {
                                path: 'length',
                                model: LengthDocument.name,
                            },
                            {
                                path: 'size',
                                model: SizesDocument.name,
                                populate: [{ path: 'size_guide', model: UploadDocuemnt.name }],
                            },
                        ],
                    },
                ])
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

                        {
                            path: 'variants',
                            model: VariantDocument.name,
                            populate: [
                                {
                                    path: 'color',
                                    select: { _id: 1, title: 1, value: 1, value2: 1 },
                                },
                                {
                                    path: 'images',
                                    model: UploadDocuemnt.name,
                                    select: { _id: 1, url: 1 },
                                },
                                {
                                    path: 'length',
                                    model: LengthDocument.name,
                                },
                                {
                                    path: 'size',
                                    model: SizesDocument.name,
                                    populate: [{ path: 'size_guide', model: UploadDocuemnt.name }],
                                },
                            ],
                        },
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

    async createProductsFilterQuery(query: QueryProductDto) {
        const validatedFilterQuery = await this.validateFilterQuery(query);
        const queryFilter: Record<string, any> = {};

        if (query.categoryId && query.categoryId.length > 0) {
            queryFilter['category'] = {
                $in: [].concat(
                    ...(await Promise.all(
                        (validatedFilterQuery.categoryId as string[]).map(async (c) => {
                            let allCtg: Types.ObjectId[] = [];

                            const isChild = await this.categoryService.isChildCategory(c);
                            if (isChild) {
                                allCtg.push(new Types.ObjectId(c));
                            } else {
                                const childs = await this.categoryService.getChildByParentId(c);
                                childs.forEach((ci) => {
                                    allCtg.push(new Types.ObjectId(ci._id));
                                });
                            }

                            return allCtg;
                        }),
                    )),
                ),
            };
        }

        if (query.minPrice && query.maxPrice) {
            queryFilter.price = { $gte: Number(query.minPrice), $lte: Number(query.maxPrice) };
        }

        if (query.brandId && query.brandId.length > 0) {
            queryFilter.brand = { $in: (validatedFilterQuery.brandId as string[]).map((b) => new Types.ObjectId(b)) };
        }

        if (query.size && query.size.length > 0) {
            queryFilter['availableSizes'] = { $in: validatedFilterQuery.size };
        }

        if (query.color && query.color.length > 0) {
            queryFilter['color'] = { $in: (validatedFilterQuery.color as string[]).map((c) => new Types.ObjectId(c)) };
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
        return queryFilter;
    }
}
