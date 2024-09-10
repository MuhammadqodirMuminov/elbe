// src/contact/schemas/contact.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class ContactDocument extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    message: string;
}

export const ContactSchema = SchemaFactory.createForClass(ContactDocument);
