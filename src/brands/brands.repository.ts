import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { BrandDocument } from './models/brand.schema';

@Injectable()
export class BrandRepository extends AbstractRepository<BrandDocument> {
    protected readonly logger = new Logger(BrandDocument.name);

    constructor(@InjectModel(BrandDocument.name) banModel: Model<BrandDocument>) {
        super(banModel);
    }
}
