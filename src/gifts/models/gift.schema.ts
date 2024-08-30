import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class GiftDocument extends AbstractDocument {
    @Prop({ type: String, unique: true, required: true })
    code: string;

    @Prop({ type: Number, required: false, default: 0 })
    amount?: number;

    @Prop({ type: Date, required: false, default: new Date() })
    expiration_date?: Date;

    @Prop({ type: Boolean, required: true, default: false })
    redeem?: boolean;

    @Prop({ type: Date, required: false })
    redeem_at?: Date;
}

export const GiftSchema = SchemaFactory.createForClass(GiftDocument);
