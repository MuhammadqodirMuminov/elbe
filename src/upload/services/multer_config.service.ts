import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createMulterOptions(): MulterModuleOptions {
        try {
            const region = this.configService.get('AWS_S3_REGION');

            const client = new S3Client({
                forcePathStyle: false,
                region,
                credentials: {
                    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
                },
            });

            return {
                storage: multerS3({
                    contentType: multerS3.AUTO_CONTENT_TYPE,
                    s3: client,
                    bucket: this.configService.get('S3_BUCKET'),
                    key: function (_, file, cb) {
                        cb(null, `${randomStringGenerator()}${file.originalname}`);
                    },
                    acl: 'public-read',
                }),
            };
        } catch (error) {
            console.log(error);
        }
    }
}
