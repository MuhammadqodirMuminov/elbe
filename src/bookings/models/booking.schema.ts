import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Appointment } from 'src/appointment/models/appointment.schema';
import { BranchDocument } from 'src/branches/models/branch.schema';
import { AbstractDocument } from 'src/database/abstract.schema';
import { ServiceDocument } from 'src/services/models/service.schema';

@Schema({ versionKey: false, timestamps: true })
export class BookingDocument extends AbstractDocument {
    @Prop({ type: String, required: false })
    user_name: string;

    @Prop({ type: String, required: false })
    email: string;

    @Prop({ type: String, required: false })
    phone: string;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ type: Types.ObjectId, required: true, ref: Appointment.name })
    appointment_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: ServiceDocument.name })
    service_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: BranchDocument.name })
    branch_id: Types.ObjectId;
}

export const bookingsSchema = SchemaFactory.createForClass(BookingDocument);
