import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PayOptions, PaymentMethods } from 'src/common';
import { Order } from 'src/orders/models/order.schema';

@Schema({ versionKey: false, timestamps: true })
export class PaymentDocuemnt extends Document {
    @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
    order: Types.ObjectId;

    @Prop({ type: String, enum: PaymentMethods, required: true })
    paymentGateway: PaymentMethods;

    @Prop({ unique: true, required: true })
    transactionId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    paymentDate: Date;

    @Prop({ type: String, enum: PayOptions, required: true })
    status: PayOptions;

    @Prop({ type: Object })
    details?: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocuemnt);
