import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { ColorDocument } from './color.schema';
import { LengthDocument } from './length.schema';

@Schema({ versionKey: false, timestamps: true })
export class VariantDocument extends AbstractDocument {
    @Prop({
        type: [
            {
                title: { type: String, required: true },
                priority: { type: Number, required: true },
                value: { type: [String], required: true },
            },
        ],
        required: false,
    })
    attributes?: { title: string; priority: number; value: string[] }[];

    @Prop({
        type: Types.ObjectId,
        ref: ColorDocument.name,
        required: true,
    })
    color: Types.ObjectId;

    @Prop({ type: [String] })
    size: string[];

    @Prop({ type: String, required: true, index: true })
    sku: string;

    @Prop({ type: String, required: true, index: true })
    barcode: string;

    @Prop({ type: Number, required: false })
    quantity: number;

    @Prop({
        type: [{ type: Types.ObjectId, required: true, ref: LengthDocument.name }],
        required: false,
    })
    length: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: UploadDocuemnt.name, required: false }] })
    images: Types.ObjectId[];

    @Prop([{ type: Types.ObjectId, ref: 'Review', default: [] }])
    reviews?: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, required: true, ref: 'ProductDocument' })
    productId: Types.ObjectId;
}

export const VariantSchema = SchemaFactory.createForClass(VariantDocument);
