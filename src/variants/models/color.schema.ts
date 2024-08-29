import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class ColorDocument extends AbstractDocument {
    @Prop({ type: String, required: false })
    title: string;

    @Prop({ type: Number, required: true, default: 1 })
    priority: number;

    @Prop({ type: String, required: true, default: 'White' })
    value: string;

    @Prop({ type: String, required: false })
    value2?: string;
}

export const colorSchema = SchemaFactory.createForClass(ColorDocument);
