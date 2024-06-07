import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { ProductDocument } from './models/product.schema';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
    protected logger = new Logger(ProductDocument.name);
    constructor(
        @InjectModel(ProductDocument.name)
        productModel: Model<ProductDocument>,
    ) {
        super(productModel);
    }
}
