import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { AbstractDocument } from 'src/database/abstract.schema';
import { CartItemsDocument } from './car-item.schema';

@Schema({ versionKey: false, timestamps: true })
export class CartDocument extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
    user: Types.ObjectId;

    @Prop({
        type: [{ type: Types.ObjectId, ref: CartItemsDocument.name, required: false }],
        required: false,
    })
    items?: CartItemsDocument[];

    @Prop({ type: Boolean, required: false, default: false })
    is_order_created?: boolean;
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);
