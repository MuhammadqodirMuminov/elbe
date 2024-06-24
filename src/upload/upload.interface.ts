import { Response } from 'express';
import { UploadDocuemnt } from './models/upload.schema';

export interface MediaServiceContract {
    create: (file: Express.Multer.File) => Promise<UploadDocuemnt>;
    delete: (media: UploadDocuemnt) => Promise<void>;
    get: (media: UploadDocuemnt, res: Response, range?: string) => Promise<void>;
}

export interface S3File extends Express.Multer.File {
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    contentDisposition: null;
    storageClass: string;
    serverSideEncryption: null;
    metadata: any;
    location: string;
    etag: string;
}
