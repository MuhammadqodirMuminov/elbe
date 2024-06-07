// src/schemas/discount.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
    FREE_DELIVERY = 'free_delivery',
    REFER_FRIEND = 'refer_friend',
    STUDENT = 'student',
    GIFT_CARD = 'gift_card',
    E_GIFT_CARD = 'e_gift_card',
}

@Schema({ versionKey: false, timestamps: true })
export class Discount extends Document {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop()
    discount?: number;

    @Prop()
    type: string;

    @Prop()
    expiryDate?: Date;

    @Prop({ required: true })
    isActive: boolean;

    @Prop()
    applicableTo?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    applicableProducts?: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    applicableCategories?: Types.ObjectId[];

    @Prop()
    minimumOrderValue?: number;

    @Prop()
    freeDeliveryMinimumOrderValue?: number;

    @Prop()
    referFriendDiscountPercentage?: number;

    @Prop()
    studentDiscountPercentage?: number;

    @Prop()
    giftCardValue?: number;

    @Prop()
    eGiftCardValue?: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
