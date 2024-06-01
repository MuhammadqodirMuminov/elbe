import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ROLES, USER_STATUS } from 'src/auth/interface/auth.interface';
import { AbstractDocument } from '../../../database/abstract.schema';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
    @Prop()
    firstname?: string;

    @Prop()
    lastname?: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, enum: ROLES })
    role: ROLES;

    @Prop({ type: String, enum: USER_STATUS })
    status: USER_STATUS;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
