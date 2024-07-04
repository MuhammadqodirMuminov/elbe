import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';

@Schema({ versionKey: false, timestamps: true })
export class BrandDocument extends AbstractDocument {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: UploadDocuemnt.name, required: true })
    logo: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(BrandDocument);
