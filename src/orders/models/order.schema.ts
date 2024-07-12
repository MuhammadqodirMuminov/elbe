import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdressDocument } from 'src/adresses/models/adress.schema';
import { CartDocument } from 'src/cart/models/cart.schema';
import { OrderStatus } from 'src/common';
import { PaymentDocuemnt } from 'src/payment/models/payment.schema';

export type OrderDocument = Order & Document;

@Schema({ versionKey: false, timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'UserDocument', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: CartDocument.name, required: true })
    cart_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: AdressDocument.name, required: true })
    address_id: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: PaymentDocuemnt.name, required: false })
    payments?: Types.Array<Types.ObjectId>;

    @Prop({ type: Types.ObjectId, ref: PaymentDocuemnt.name, required: false })
    success_payment_id?: Types.ObjectId;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.CREATED, required: true })
    orderStatus: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
