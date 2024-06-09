import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { ProductDocument } from 'src/products/models/product.schema';

export type ReviewDocument = Review & Document;

@Schema({ versionKey: false, timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: ProductDocument.name, required: true })
    product: Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
