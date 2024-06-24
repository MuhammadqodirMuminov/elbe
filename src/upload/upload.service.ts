import { S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { UploadDocuemnt } from './models/upload.schema';
import { S3Service } from './services/s3.service';
import { MediaServiceContract } from './upload.interface';

@Injectable()
export class UploadService {
    serviceHandler: MediaServiceContract;
    private logger = new Logger(UploadService.name);
    private region: string;
    private s3Client: S3Client;

    constructor(
        @InjectModel(UploadDocuemnt.name) private readonly uplodModel: Model<UploadDocuemnt>,
        private readonly configService: ConfigService,
    ) {
        this.region = configService.get<string>('AWS_S3_REGION');
        this.s3Client = new S3Client({
            region: this.region,
        });
        this.serviceHandler = new S3Service(uplodModel, configService);
    }

    async create(file: Express.Multer.File): Promise<UploadDocuemnt> {
        try {
            return await this.serviceHandler.create(file);
        } catch (error) {
            console.log(error);
        }
    }

    async update(file: Express.Multer.File, id?: string) {
        if (id) {
            const media = await this.uplodModel.findById({ _id: id });
            this.serviceHandler.delete(media);
        }
        return await this.serviceHandler.create(file);
    }

    async deleteMedia(id: string) {
        const media = await this.uplodModel.findById({ _id: id });
        await this.serviceHandler.delete(media);
        await this.uplodModel.deleteOne({ _id: id });
    }

    async get(id: string, res: Response, range: string) {
        const media = await this.uplodModel.findById({ _id: id });
        return await this.serviceHandler.get(media, res, range);
    }

    async findOne(_id: string) {
        const file = await this.uplodModel.findOne({ _id: _id });
        if (!file) {
            throw new NotFoundException('No such file found');
        }
        return file;
    }
}
