import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BranchDocument } from 'src/branches/models/branch.schema';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class ServiceDocument extends AbstractDocument {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: false })
    description: string;

    @Prop([{ type: Types.ObjectId, required: true, ref: BranchDocument.name }])
    branches: Types.ObjectId[];
}

export const serviceSchema = SchemaFactory.createForClass(ServiceDocument);
