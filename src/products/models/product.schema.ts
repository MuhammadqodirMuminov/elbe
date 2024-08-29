import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BrandDocument } from 'src/brands/models/brand.schema';
import { AbstractDocument } from 'src/database/abstract.schema';
import { Discount } from 'src/discounts/models/discount.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { VariantDocument } from 'src/variants/models/variant.schema';

@Schema({ versionKey: false, timestamps: true })
export class ProductDocument extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: Number, required: false, default: 0 })
    sold_amount: number;

    @Prop({ type: Boolean, required: false, default: false })
    isOnOffer?: boolean;

    @Prop({ type: Types.ObjectId, required: false, ref: BrandDocument.name })
    brand?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'CategoryDocument', default: null })
    category: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: UploadDocuemnt.name })
    image: Types.ObjectId;

    @Prop([{ type: Types.ObjectId, required: true, ref: VariantDocument.name }])
    variants: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, required: false, ref: Discount.name })
    discounts?: Discount[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
