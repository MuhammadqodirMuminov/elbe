import { S3 } from '@aws-sdk/client-s3';
import { HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { Readable } from 'stream';
import { UploadDocuemnt } from '../models/upload.schema';
import { MediaServiceContract, S3File } from '../upload.interface';

export class S3Service implements MediaServiceContract {
    logger = new Logger(S3Service.name);
    client: S3;
    bucket: string;

    constructor(
        private readonly uplodModel: Model<UploadDocuemnt>,
        private readonly configService: ConfigService,
    ) {
        this.client = new S3({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucket = configService.get('S3_BUCKET');
    }

    async get(media: UploadDocuemnt, res: Response, range?: string) {
        try {
            const response = await this.client.getObject({
                Bucket: this.bucket,
                Key: media.filename,
                Range: range,
                ResponseContentType: media.mimetype,
            });
            res.setHeader('content-length', response.ContentLength);
            res.setHeader('content-type', response.ContentType);
            res.setHeader('accept-ranges', response.AcceptRanges);
            res.setHeader('etag', response.ETag);
            res.status(response.$metadata.httpStatusCode);

            (response.Body as Readable).pipe(res);
        } catch {
            res.status(404).json({ message: 'Media not found.' });
        }
    }

    async create(file: S3File) {
        try {
            return await this.uplodModel.create({
                _id: new Types.ObjectId(),
                filename: file.key,
                url: file.location,
                mimetype: file.contentType,
                size: file.size,
            });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async delete(upload: UploadDocuemnt) {
        try {
            await this.client.deleteObject({
                Bucket: this.configService.get('S3_BUCKET'),
                Key: upload.filename,
            });
        } catch (e) {
            this.logger.error(e);
        }
    }
}
