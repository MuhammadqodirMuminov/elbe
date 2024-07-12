import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { PaymentMethods, PaymentStatus } from 'src/common';
import { Discount } from 'src/discounts/models/discount.schema';

@Schema({ versionKey: false, timestamps: true })
export class PaymentDocuemnt extends Document {
    @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    order_id: Types.ObjectId;

    @Prop({ type: String, required: false })
    transaction_id?: string;

    @Prop({ type: String, enum: PaymentMethods, required: true })
    paymentGateway: PaymentMethods;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING, required: true })
    paymentStatus: PaymentStatus;

    @Prop({ type: [{ type: Types.ObjectId, ref: Discount.name }], required: false })
    appliedDiscounts?: Types.ObjectId[];

    @Prop({ type: Object })
    details?: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocuemnt);
