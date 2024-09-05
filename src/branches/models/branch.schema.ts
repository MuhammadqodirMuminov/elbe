import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class BranchDocument extends AbstractDocument {
    @ApiProperty()
    @Prop({ type: String, required: true })
    name: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    description: string;
}

export const branchSchema = SchemaFactory.createForClass(BranchDocument);
