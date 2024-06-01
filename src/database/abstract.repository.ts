import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract logger: Logger;

    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (await createDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(
        filterQuery: FilterQuery<TDocument>,
        populate?: string | string[],
    ): Promise<TDocument> {
        const document = await this.model
            .findOne(filterQuery)
            .populate(populate)
            .lean<TDocument>(true);

        if (!document) {
            this.logger.warn(
                'No document found for filter query ' + filterQuery,
            );
            throw new NotFoundException('No document found');
        }

        return document;
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        populate?: string | string[],
    ): Promise<TDocument[]> {
        const documents = await this.model
            .find(filterQuery)
            .populate(populate)
            .lean<TDocument[]>(true);
        return documents;
    }

    async fundOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument> {
        const document = await this.model
            .findOneAndUpdate(filterQuery, update, { new: true })
            .lean<TDocument>(true);

        if (!document) {
            this.logger.warn(
                'No document found for filter query ' + filterQuery,
            );
            throw new NotFoundException('No document found');
        }

        return document;
    }

    async findOneAndDelete(
        filterQuery: FilterQuery<TDocument>,
    ): Promise<TDocument> {
        const document = await this.model
            .findOneAndDelete(filterQuery)
            .lean<TDocument>(true);

        if (!document) {
            this.logger.warn(
                'No document found for filter query ' + filterQuery,
            );
            throw new NotFoundException('No document found');
        }

        return document;
    }
}
