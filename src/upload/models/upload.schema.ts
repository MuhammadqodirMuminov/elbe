import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class UploadDocuemnt extends AbstractDocument {
    @Prop({ type: String, length: 150 })
    filename: string;

    @Prop({ type: String })
    url: string;

    @Prop({ type: String, length: 150 })
    mimetype: string;

    @Prop({ type: Number, required: false })
    size?: number;
}

export const UploadScheam = SchemaFactory.createForClass(UploadDocuemnt);
