import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { ServiceDocument } from 'src/services/models/service.schema';

@Schema({ timestamps: true, versionKey: false })
export class Appointment extends AbstractDocument {
    @ApiProperty()
    @Prop({ type: String, required: false })
    time: string;

    @ApiProperty()
    @Prop({ type: String, required: false })
    desription: string;

    @ApiProperty()
    @Prop([{ type: Types.ObjectId, ref: ServiceDocument.name, required: true }])
    service: Types.ObjectId[];
}

export const appointmentSchema = SchemaFactory.createForClass(Appointment);
