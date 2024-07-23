import { BadRequestException, HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { CartService } from 'src/cart/cart.service';
import { PaymentStatus } from 'src/common';
import { OrdersService } from 'src/orders/orders.service';
import { QueryProductDto } from 'src/products/dto/query.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { AdressesService } from '../adresses/adresses.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentDocuemnt } from './models/payment.schema';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(PaymentDocuemnt.name) private paymentModel: Model<PaymentDocuemnt>,
        private readonly cartService: CartService,
        private readonly addressService: AdressesService,
        private readonly orderService: OrdersService,
        @Inject(forwardRef(() => StripeService)) private readonly stripeService: StripeService,
    ) {}

    async getAll(query: QueryProductDto, user: UserDocument) {
        try {
            const { page = 1, limit = 10, search = '' } = query;
            const orders = await this.paymentModel
                .find({ user_id: new Types.ObjectId(user._id) })
                .skip((+page - 1) * +limit)
                .limit(Number(limit));

            const total = await this.paymentModel.countDocuments({ category: user._id }).exec();

            return { data: orders, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNextPage: +page * +limit < total, hasPrevPage: +page > 1 };
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async create(createPaymentDto: CreatePaymentDto, user: UserDocument) {
        try {
            const cart = await this.cartService.getOrcreate(user);

            const address = await this.addressService.findOne(createPaymentDto.address_id);

            // create an order or get existing order
            const order = await this.orderService.upsert(user, address, cart);

            // find previous payment intent and cancel it
            const payment = await this.paymentModel.findOne({
                order_id: order._id,
                status: PaymentStatus.PENDING,
            });
            if (payment) {
                await this.stripeService.cancelIntent(payment.transaction_id);
                await this.paymentModel.updateOne({ _id: payment._id }, { paymentStatus: PaymentStatus.CANCELED });
            }

            // calculate price  of cart
            const amount = cart.items.reduce((total, item: any) => {
                return total + (Number(item.variant_id.productId?.price) + Number(item.variant_id?.price || 0)) * item.quantity;
            }, 0);

            const intent = await this.stripeService.createPaymentIntent(amount, createPaymentDto.payment_method);

            const newPayment = await this.paymentModel.create({
                _id: new Types.ObjectId(),
                transaction_id: intent.id,
                order_id: order._id,
                user_id: new Types.ObjectId(user._id),
                paymentGateway: createPaymentDto.payment_gateway,
            });

            return {
                metadata: {
                    clientSecret: intent.client_secret,
                },
                payment: newPayment,
            };
        } catch (error) {
            throw new HttpException(error?.message, error?.status || 500);
        }
    }

    async findAll(): Promise<PaymentDocuemnt[]> {
        return this.paymentModel.find().populate('order').exec();
    }

    async findOne(id: string): Promise<PaymentDocuemnt> {
        return this.paymentModel.findById(id).populate('order').exec();
    }

    async getPaymentByTransactionId(id: string) {
        const payment = await this.paymentModel.findOne({ transaction_id: id });
        return payment;
    }
}
