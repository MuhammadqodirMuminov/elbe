import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ versionKey: false })
export class TokenDocument extends AbstractDocument {
    @Prop()
    hash_token: string;

    @Prop()
    expire_date: Date;

    @Prop()
    email: string;
}

export const TokenSchema = SchemaFactory.createForClass(TokenDocument);
