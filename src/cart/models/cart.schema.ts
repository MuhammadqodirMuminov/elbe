import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false, timestamps: false })
export class CartDocument extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
    user: Types.ObjectId;

    @Prop({
        type: [
            {
                productId: { type: Types.ObjectId, required: true },
                quantity: { type: Number, required: true },
                _id: false,
            },
        ],
        required: true,
    })
    items: { productId: Types.ObjectId; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);
