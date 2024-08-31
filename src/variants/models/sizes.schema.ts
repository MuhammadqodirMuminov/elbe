import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { AbstractDocument } from 'src/database/abstract.schema';
import { SizeGuideDocument } from './size-guide.schema';

@Schema({ versionKey: false, timestamps: true })
export class SizesDocument extends AbstractDocument {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: [String], required: true })
    value: string[];

    @Prop({ type: [Types.ObjectId], required: false, ref: SizeGuideDocument.name })
    size_guide?: Types.ObjectId[];

    // relation
    @Prop({ type: String, required: true, ref: CategoryDocument.name })
    category: Types.ObjectId;
}

export const sizesSchema = SchemaFactory.createForClass(SizesDocument);
