import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/database/abstract.repository';
import { CategoryDocument } from './models/category.schema';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
    protected logger = new Logger(CategoryDocument.name);
    constructor(
        @InjectModel(CategoryDocument.name)
        categoryModel: Model<CategoryDocument>,
    ) {
        super(categoryModel);
    }
}
