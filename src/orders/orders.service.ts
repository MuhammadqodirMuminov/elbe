import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdressDocument } from 'src/adresses/models/adress.schema';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { UsersRepository } from 'src/auth/users/users.repository';
import { CartService } from 'src/cart/cart.service';
import { CartItemsDocument } from 'src/cart/models/car-item.schema';
import { CartDocument } from 'src/cart/models/cart.schema';
import { OrderStatus } from 'src/common';
import { PaymentDocuemnt } from 'src/payment/models/payment.schema';
import { QueryProductDto } from 'src/products/dto/query.dto';
import { ProductsService } from 'src/products/products.service';
import { VariantsService } from 'src/variants/variants.service';
import { OrderDocument } from './models/order.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(OrderDocument.name) private readonly orderModel: Model<OrderDocument>,
        @InjectModel(CartItemsDocument.name) private readonly cartItemModel: Model<CartItemsDocument>,
        private readonly usersRepository: UsersRepository,
        private readonly cartService: CartService,
        private readonly productService: ProductsService,
        private readonly variantService: VariantsService,
    ) {}

    async upsert(user: UserDocument, address: AdressDocument, cart: CartDocument) {
        if (!cart?.items?.length) {
            throw new ForbiddenException('Cart should contain atleast 1 item.');
        }
        let order = await this.orderModel.findOne({
            cart_id: cart._id,
        });

        if (!order) {
            order = await this.orderModel.create({
                _id: new Types.ObjectId(),
                cart_id: new Types.ObjectId(cart._id),
                user_id: new Types.ObjectId(user._id),
                address_id: new Types.ObjectId(address._id),
            });
        }
        if (order.address_id !== address._id) {
            order.address_id = address._id;
            await order.save();
        }

        return order;
    }

    async getAll(query: QueryProductDto, user: UserDocument) {
        try {
            const { page = 1, limit = 10, search = '' } = query;
            const orders = await this.orderModel
                .find({ user_id: new Types.ObjectId(user._id), $or: [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }] })
                .skip((+page - 1) * +limit)
                .limit(Number(limit));

            const total = await this.orderModel.countDocuments({ category: user._id }).exec();

            return { data: orders, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async findAll(): Promise<OrderDocument[]> {
        return this.orderModel.find().exec();
    }

    async getOrderById(id: string) {
        const order = await this.orderModel.findOne({ _id: id });

        if (!order) throw new NotFoundException(`Order ${id} not found`);
        return order;
    }

    async afterPaymentConcluded(order: OrderDocument, status: OrderStatus, payment: PaymentDocuemnt) {
        const user = await this.usersRepository.findOne({ _id: order.user_id });

        const cart = await this.cartService.getOrcreate(user);

        // freeze all the cart items with price
        cart?.items?.forEach(async (item) => {
            const variant = await this.variantService.findOne(item.variant_id._id.toString());
            const product = await this.productService.findOne(variant.productId._id.toString());

            await this.productService.updateWithQuery({ _id: variant.productId._id }, { $inc: { sold_amount: item.quantity } });
            await this.cartItemModel.updateOne({ _id: item._id }, { price: product?.price * item.quantity });
        });

        await this.cartService.update(cart._id.toString(), { is_order_created: true });

        return await this.orderModel.updateOne(
            { _id: order._id },
            {
                orderStatus: status,
                success_payment_id: payment.transaction_id,
                static_address: order.static_address,
                $push: { payments: payment._id },
            },
        );
    }
}
