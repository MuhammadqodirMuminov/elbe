import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { BanDocument } from './models/ban.schema';

@Injectable()
export class BanRepository extends AbstractRepository<BanDocument> {
    protected readonly logger = new Logger(BanDocument.name);

    constructor(@InjectModel(BanDocument.name) banModel: Model<BanDocument>) {
        super(banModel);
    }
}
