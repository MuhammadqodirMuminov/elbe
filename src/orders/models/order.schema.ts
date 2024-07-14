import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AdressDocument } from 'src/adresses/models/adress.schema';
import { CartDocument } from 'src/cart/models/cart.schema';
import { OrderStatus } from 'src/common';
import { AbstractDocument } from 'src/database/abstract.schema';
import { PaymentDocuemnt } from 'src/payment/models/payment.schema';

@Schema({ versionKey: false, timestamps: true })
export class OrderDocument extends AbstractDocument {
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

    @Prop({ type: JSON, nullable: true })
    static_address: JSON;
}

export const OrderSchama = SchemaFactory.createForClass(OrderDocument);
