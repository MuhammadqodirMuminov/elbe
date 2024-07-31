import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { ProductDocument } from 'src/products/models/product.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';

@Schema({ versionKey: false, timestamps: true })
export class CategoryDocument extends AbstractDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CategoryDocument.name })
    parent_id?: Types.ObjectId;

    @Prop({ default: false })
    isActive?: boolean;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: Types.ObjectId, ref: UploadDocuemnt.name })
    image: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: ProductDocument.name }], default: [] })
    products?: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(CategoryDocument);
