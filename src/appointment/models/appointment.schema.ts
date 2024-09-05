import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class Appointment extends AbstractDocument {
    @Prop({ type: String })
    name: String;
}

export const appointmentSchema = SchemaFactory.createForClass(Appointment);
