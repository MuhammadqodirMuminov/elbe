import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false })
export class OtpDocument extends AbstractDocument {
    @Prop()
    code: String;

    @Prop()
    email: String;

    @Prop({ type: 'Number' })
    attempt: number;

    @Prop()
    expire_date: Date;
}

export const OtpSchema = SchemaFactory.createForClass(OtpDocument);
