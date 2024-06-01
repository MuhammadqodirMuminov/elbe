import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false })
export class BanDocument extends AbstractDocument {
    @Prop()
    email: string;

    @Prop()
    ban_time: Date;
}

export const BanSchema = SchemaFactory.createForClass(BanDocument);
