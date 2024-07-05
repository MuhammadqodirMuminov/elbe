import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { VariantDocument } from 'src/variants/models/variant.schema';

@Schema({ versionKey: false, timestamps: true })
export class CartItemsDocument extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: VariantDocument.name, required: true })
    variant_id: Types.ObjectId;

    @Prop({ type: Number, required: true, default: 1 })
    quantity: number;

    @Prop({ type: Types.ObjectId, ref: 'CartDocument', required: true })
    cart_id: Types.ObjectId;
}

export const CartItemsSchema = SchemaFactory.createForClass(CartItemsDocument);
