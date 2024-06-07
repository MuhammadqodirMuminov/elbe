import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { CartDocument } from './models/cart.schema';

@Injectable()
export class CartRepository extends AbstractRepository<CartDocument> {
    protected logger = new Logger(CartDocument.name);
    constructor(
        @InjectModel(CartDocument.name)
        cartModel: Model<CartDocument>,
    ) {
        super(cartModel);
    }
}
