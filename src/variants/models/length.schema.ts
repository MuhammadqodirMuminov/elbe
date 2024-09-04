import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class LengthDocument extends AbstractDocument {
    @Prop({ type: String, required: true })
    key: string;

    @Prop({ type: String, required: true })
    value: string;

    @Prop({ type: String, required: false })
    description?: string;
}

export const lengthSchema = SchemaFactory.createForClass(LengthDocument);
