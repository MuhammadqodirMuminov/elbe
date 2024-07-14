import { HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { ProductDocument } from 'src/products/models/product.schema';
import { ProductsService } from 'src/products/products.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { VariantsService } from 'src/variants/variants.service';
import { CartRepository } from './cart.repository';
import { UpdateCartDto } from './dto/create-cart.dto';
import { CartItemsDocument } from './models/car-item.schema';
import { CartDocument } from './models/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(CartDocument.name) private cartModel: Model<CartDocument>,
        @InjectModel(CartItemsDocument.name) private cartItemModel: Model<CartItemsDocument>,
        private readonly cartRepository: CartRepository,
        private readonly variantService: VariantsService,
        @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService,
    ) {}

    async getOrcreate(user: UserDocument): Promise<CartDocument> {
        const existCart = await this.cartModel.findOne(
            { user: new Types.ObjectId(user._id), is_order_created: false },
            {},
            {
                populate: [
                    {
                        path: 'user',
                        select: { _id: 1, firstname: 1, lastname: 1, email: 1 },
                    },
                    {
                        path: 'items',
                        model: CartItemsDocument.name,
                        select: { cart_id: 0 },
                        populate: [
                            {
                                path: 'variant_id',
                                model: VariantDocument.name,
                                populate: [
                                    {
                                        path: 'images',
                                        model: UploadDocuemnt.name,
                                        select: { _id: 1, url: 1 },
                                    },
                                    {
                                        path: 'productId',
                                        model: ProductDocument.name,
                                        select: { _id: 1, name: 1, image: 1, description: 1, price: 1 },
                                        populate: [
                                            {
                                                path: 'image',
                                                model: UploadDocuemnt.name,
                                                select: { _id: 1, url: 1 },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );
        if (!existCart) {
            return (await this.cartModel.create({ user: new Types.ObjectId(user._id), is_order_created: false, _id: new Types.ObjectId() })).populate([
                {
                    path: 'user',
                    select: { _id: 1, firstname: 1, lastname: 1, email: 1 },
                },
                {
                    path: 'items',
                    model: CartItemsDocument.name,
                    select: { cart_id: 0 },
                    populate: [
                        {
                            path: 'variant_id',
                            model: VariantDocument.name,
                            populate: [
                                {
                                    path: 'images',
                                    model: UploadDocuemnt.name,
                                    select: { _id: 1, url: 1 },
                                },
                            ],
                        },
                    ],
                },
            ]);
        }
        return existCart;
    }

    async updateActiveCart(user: UserDocument, updateActiveCart: UpdateCartDto) {
        try {
            const variant = await this.variantService.findOne(updateActiveCart.variantId);

            const cart = await this.getOrcreate(user);

            let cartItem = await this.cartItemModel.findOne({
                variant_id: variant._id,
                cart_id: cart._id,
            });

            if (!cartItem) {
                cartItem = await this.cartItemModel.create({
                    variant_id: variant._id,
                    quantity: updateActiveCart.quantity,
                    cart_id: cart._id,
                    _id: new Types.ObjectId(),
                });
                await this.cartModel.updateOne({ _id: cart._id, is_order_created: false }, { $push: { items: cartItem._id } });
            } else {
                cartItem.quantity = updateActiveCart.quantity;
                cartItem.save();
            }

            return this.getOrcreate(user);
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async emptyActiveCart(user: UserDocument) {
        const cart = await this.getOrcreate(user);
        await this.cartItemModel.deleteMany({ cart_id: cart._id });
        await this.cartModel.updateOne({ _id: cart._id, is_order_created: false }, { items: [] });
        return this.getOrcreate(user);
    }

    async removeItem(cartItemId: string, user: UserDocument) {
        const cartItem: any = await this.cartItemModel.findOne({ _id: cartItemId }, {}, { populate: [{ path: 'cart_id', model: CartDocument.name, populate: [{ path: 'user' }] }] });

        if (cartItem.cart_id.user._id.toString() !== user._id.toString()) {
            throw new NotFoundException('cart item not found.');
        }
        await cartItem.deleteOne({ cart_id: cartItem.cart_id });
        await this.cartModel.updateOne({ _id: cartItem.cart_id }, { $pull: { items: cartItem._id } });
    }

    async findAll(): Promise<CartDocument[]> {
        return this.cartModel.find().populate('user', '-password').populate('items.productId', {}, ProductDocument.name).exec();
    }

    async getRecomended(user: UserDocument) {
        const userCart: any = await this.cartModel.findOne(
            { user: user._id },
            {},
            {
                populate: [
                    {
                        path: 'items',
                        model: CartItemsDocument.name,
                        populate: {
                            path: 'variant_id',
                            model: VariantDocument.name,
                            populate: [
                                {
                                    path: 'productId',
                                    model: ProductDocument.name,
                                    select: { variants: 0 },
                                },
                            ],
                        },
                    },
                ],
            },
        );

        if (userCart.items.length === 0) {
            return { message: 'No recomended producs found' };
        }
        let category = await this.productService.getAllWithQuery(
            { category: new Types.ObjectId(userCart.items[0].variant_id.productId.category) },
            {
                populate: [
                    { path: 'category', select: { products: 0 }, populate: [{ path: 'image', select: { _id: 1, url: 1 } }] },
                    { path: 'image', select: { _id: 1, url: 1 } },
                    { path: 'brand', populate: [{ path: 'logo', select: { _id: 1, url: 1 } }] },
                    { path: 'variants', model: VariantDocument.name, select: { productId: 0 }, populate: [{ path: 'images', select: { _id: 1, url: 1 }, model: UploadDocuemnt.name }] },
                ],
            },
        );

        return category.slice(0, 4);
    }

    async update(_id: string, data: Record<string, any>) {
        return await this.cartModel.updateOne({ _id }, data);
    }

    async findOne(user: UserDocument) {
        const existCart = await this.cartModel.findOne(
            { user: new Types.ObjectId(user._id), is_order_created: true },
            {},
            {
                populate: [
                    {
                        path: 'user',
                        select: { _id: 1, firstname: 1, lastname: 1, email: 1 },
                    },
                    {
                        path: 'items',
                        model: CartItemsDocument.name,
                        select: { cart_id: 0 },
                        populate: [
                            {
                                path: 'variant_id',
                                model: VariantDocument.name,
                                populate: [
                                    {
                                        path: 'images',
                                        model: UploadDocuemnt.name,
                                        select: { _id: 1, url: 1 },
                                    },
                                    {
                                        path: 'productId',
                                        model: ProductDocument.name,
                                        select: { _id: 1, name: 1, image: 1, description: 1, price: 1 },
                                        populate: [
                                            {
                                                path: 'image',
                                                model: UploadDocuemnt.name,
                                                select: { _id: 1, url: 1 },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        );

        return existCart;
    }
}
