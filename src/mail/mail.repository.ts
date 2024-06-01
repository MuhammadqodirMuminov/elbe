import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { OtpDocument } from './models/mail.schema';

@Injectable()
export class MailRepository extends AbstractRepository<OtpDocument> {
    protected logger = new Logger(OtpDocument.name);

    constructor(@InjectModel(OtpDocument.name) otpModel: Model<OtpDocument>) {
        super(otpModel);
    }
}
