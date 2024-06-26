import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AdressDocument } from 'src/adresses/models/adress.schema';
import { ROLES, USER_STATUS } from 'src/auth/interface/auth.interface';
import { UploadDocuemnt } from 'src/upload/models/upload.schema';
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

    @Prop({ type: String, required: false, ref: UploadDocuemnt.name })
    avatar: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, required: false, ref: AdressDocument.name }] })
    adresses?: Types.Array<Types.ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
