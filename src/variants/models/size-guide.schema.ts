import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
import { LengthDocument } from './length.schema';

@Schema({ versionKey: false, timestamps: true })
export class SizeGuideDocument extends AbstractDocument {
    @Prop({ type: Types.ObjectId, required: true, ref: LengthDocument.name })
    length: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: UploadDocuemnt.name })
    guide: Types.ObjectId;

    @Prop({ type: String, required: false })
    description?: string;
}

export const sizeGuideSchema = SchemaFactory.createForClass(SizeGuideDocument);
