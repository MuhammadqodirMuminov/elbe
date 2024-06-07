import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus, PaymentMethods, PaymentStatus } from 'src/common';

export type OrderDocument = Order & Document;

@Schema({ versionKey: false, timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'UserDocument', required: true })
    user: Types.ObjectId;

    @Prop({
        type: [
            {
                productId: { type: Types.ObjectId, ref: 'ProductDocument', required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                color: { type: String, required: false },
                size: { type: String, required: false },
            },
        ],
        required: true,
    })
    products: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
        color?: string;
        size?: string;
    }[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({
        type: {
            street: { type: String, required: false },
            city: { type: String, required: false },
            state: { type: String, required: false },
            zip: { type: String, required: false },
            country: { type: String, required: false },
        },
        required: false,
    })
    shippingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };

    @Prop({
        type: {
            street: { type: String, required: false },
            city: { type: String, required: false },
            state: { type: String, required: false },
            zip: { type: String, required: false },
            country: { type: String, required: false },
        },
        required: false,
    })
    billingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };

    @Prop({ type: String, enum: PaymentMethods, default: PaymentMethods.STRIPE, required: true })
    paymentMethod: PaymentMethods;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING, required: true })
    paymentStatus: PaymentStatus;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PLACED, required: true })
    shippingStatus: OrderStatus;

    // @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Discount' }], required: false })
    // appliedDiscounts?: MongooseSchema.Types.ObjectId[];

    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'DeliveryOption', required: false })
    // deliveryOption?: MongooseSchema.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
