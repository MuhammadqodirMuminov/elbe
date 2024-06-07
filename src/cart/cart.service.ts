import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from 'src/products/models/product.schema';
import { CartRepository } from './cart.repository';
import { CreateCartDto, UpdateCartDto } from './dto/create-cart.dto';
import { CartDocument } from './models/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(CartDocument.name) private cartModel: Model<CartDocument>,
        private readonly cartRepository: CartRepository,
    ) {}

    async create(createCartDto: CreateCartDto): Promise<CartDocument> {
        const createdCart = await this.cartRepository.create(createCartDto as any);
        return createdCart;
    }

    async findAll(): Promise<CartDocument[]> {
        return this.cartModel.find().populate('user', '-password').populate('items.productId', {}, ProductDocument.name).exec();
    }

    async findByUser(userId: string): Promise<CartDocument> {
        return this.cartModel.findOne({ user: userId }).populate('user', '-password').populate('items.productId', {}, ProductDocument.name).exec();
    }

    async addItem(userId: string, updateCartDto: UpdateCartDto): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({ user: userId }).exec();
        if (cart) {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === updateCartDto.productId.toString());
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += updateCartDto.quantity;
            } else {
                cart.items.push({ ...updateCartDto, productId: new Types.ObjectId(updateCartDto.productId) });
            }
            return cart.save();
        } else {
            return this.create({ user: userId, items: [updateCartDto] });
        }
    }

    async removeItem(userId: string, productId: string): Promise<CartDocument> {
        const cart = await this.cartModel.findOne({ user: userId }).exec();
        if (cart) {
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
            return cart.save();
        }
        return null;
    }

    async clearCart(userId: string): Promise<void> {
        await this.cartModel.findOneAndDelete({ user: userId }).exec();
    }
}
