import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class AdressDocument extends AbstractDocument {
    @Prop({ type: String })
    first_name: string;

    @Prop({ type: String })
    last_name: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    address: string;

    @Prop({ type: String })
    city: string;

    @Prop({ type: String })
    state: string;

    @Prop({ type: String })
    country: string;

    @Prop({ type: String })
    zip_code: string;

    @Prop({ type: Types.ObjectId, ref: 'UserDocument', required: true })
    customerId: Types.ObjectId;
}

export const AdressSchema = SchemaFactory.createForClass(AdressDocument);
