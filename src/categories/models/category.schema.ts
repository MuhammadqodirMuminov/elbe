import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false })
export class CategoryDocument extends AbstractDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CategoryDocument.name })
    parent_id?: Types.ObjectId;

    @Prop({ default: false })
    isActive?: boolean;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description?: string;

    @Prop()
    image_url: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryDocument);
