import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BrandDocument } from 'src/brands/models/brand.schema';
import { CategoryDocument } from 'src/categories/models/category.schema';
import { CollectionType } from 'src/common';
import { AbstractDocument } from 'src/database/abstract.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';

@Schema({ versionKey: false, timestamps: true })
export class CollectionDocument extends AbstractDocument {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: UploadDocuemnt.name, required: true })
    image: Types.ObjectId;

    @Prop({ type: String, enum: CollectionType, required: true })
    type: CollectionType;

    @Prop({ type: Types.ObjectId, required: false, ref: BrandDocument.name })
    brand?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: false, ref: CategoryDocument.name })
    category?: Types.ObjectId;
}

export const CollectionSchema = SchemaFactory.createForClass(CollectionDocument);
