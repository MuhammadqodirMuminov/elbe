import {
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    private logger = new Logger(UploadService.name);
    private region: string;
    private s3Client: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.region = configService.get<string>('AWS_S3_REGION');
        this.s3Client = new S3Client({
            region: this.region,
        });
    }

    async upload(file: Express.Multer.File) {
        const bucket = this.configService.get<string>('S3_BUCKET');
        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: bucket,
            Key: file.originalname,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        try {
            const response: PutObjectCommandOutput = await this.s3Client.send(
                new PutObjectCommand(input),
            );
            if (response.$metadata.httpStatusCode === 200) {
                return {
                    imageUrl: `https://${bucket}.s3.${this.region}.amazonaws.com/${file.originalname}`,
                };
            }
            throw new Error('Image not saved in s3!');
        } catch (err) {
            this.logger.error('Cannot save file to s3,', err);
            throw new BadRequestException(err.message);
        }
    }
}
