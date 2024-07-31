import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { AbstractDocument } from 'src/database/abstract.schema';
import { ProductDocument } from 'src/products/models/product.schema';

@Schema({ timestamps: true, versionKey: false })
export class WishlistDocument extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
    user: Types.ObjectId;

    @Prop([{ type: Types.ObjectId, required: true, ref: ProductDocument.name }])
    products: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(WishlistDocument);
