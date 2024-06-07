import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { VariantDto } from '../dto/create-variant.dto';

@Schema({ versionKey: false, timestamps: true })
export class ProductDocument extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: Types.ObjectId, ref: 'CategoryDocument', default: null })
    category: Types.ObjectId;

    @Prop([String])
    images: string[];

    @Prop({ required: true })
    stock: number;

    @Prop([{ type: Types.ObjectId, ref: 'Review', default: [] }])
    reviews?: Types.ObjectId[];

    @Prop([VariantDto])
    variants: VariantDto[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
