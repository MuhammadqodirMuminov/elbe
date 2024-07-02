import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';

@Schema({ versionKey: false, timestamps: true })
export class VariantDocument extends AbstractDocument {
    @Prop({ type: JSON, required: false })
    attributes?: Record<string, any>;

    @Prop({ type: String })
    color: string;

    @Prop({ type: String })
    size: string;

    @Prop({ type: Number, required: false })
    price: number;

    @Prop({ type: String, required: true })
    sku: string;

    @Prop({ type: String, required: true })
    barcode: string;

    @Prop({ type: Number, required: false })
    quantity: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: UploadDocuemnt.name, required: false }] })
    images: Types.ObjectId[];

    @Prop([{ type: Types.ObjectId, ref: 'Review', default: [] }])
    reviews?: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, required: true, ref: 'ProductDocument' })
    productId: Types.ObjectId;
}

export const VariantSchema = SchemaFactory.createForClass(VariantDocument);
