import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { UsersService } from 'src/auth/users/users.service';
import { ProductDocument } from 'src/products/models/product.schema';
import { ProductsService } from 'src/products/products.service';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { VariantDocument } from 'src/variants/models/variant.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistDocument } from './models/wishlist.schema';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectModel(WishlistDocument.name) private readonly wishlistModel: Model<WishlistDocument>,
        private readonly userService: UsersService,
        private readonly productService: ProductsService,
    ) {}

    async create(createWishlistDto: CreateWishlistDto, user: UserDocument) {
        const product = await this.productService.findOne(createWishlistDto.productId);

        const existingWishlist = await this.wishlistModel.findOne({ user: new Types.ObjectId(user._id) });

        if (existingWishlist) {
            const existingProduct = await this.wishlistModel.findOne({ user: new Types.ObjectId(user._id), products: new Types.ObjectId(product._id) });
            if (existingProduct) {
                throw new BadRequestException('This product already exist in wishlist!');
            }
            const wishlist = await this.wishlistModel.updateOne({ _id: existingWishlist._id }, { $push: { products: new Types.ObjectId(product._id) } });
            return { message: 'Succesfully addded product to wishlist!' };
        } else {
            const newWishlist = await this.wishlistModel.create({ _id: new Types.ObjectId(), user: user._id, products: [new Types.ObjectId(product._id)] });
            return await newWishlist.save();
        }
    }

    async getAll(user: UserDocument) {
        const wishlist = await this.wishlistModel.findOne(
            { user: new Types.ObjectId(user._id) },
            {},
            {
                populate: [
                    { path: 'user', select: { password: 0 } },
                    {
                        path: 'products',
                        model: ProductDocument.name,
                        populate: [
                            {
                                path: 'image',
                                select: { _id: 1, url: 1 },
                            },
                            {
                                path: 'category',
                                select: { products: 0 },
                            },
                            {
                                path: 'brand',
                            },
                            {
                                path: 'variants',
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
                ],
            },
        );
        return wishlist;
    }

    async remove(id: string, user: UserDocument) {
        const product = await this.productService.findOne(id);

        const existingWishlist = await this.wishlistModel.findOne({ user: new Types.ObjectId(user._id) });
        if (!existingWishlist) {
            throw new NotFoundException('wishlist not found');
        }
        await existingWishlist.updateOne({ $pull: { products: new Types.ObjectId(product._id) } });
        return await existingWishlist.save();
    }
}
