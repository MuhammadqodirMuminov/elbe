import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UploadDocuemnt, UploadScheam } from './models/upload.schema';
import { MulterConfigService } from './services/multer_config.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),

        MongooseModule,
        MongooseModule.forFeature([{ name: UploadDocuemnt.name, schema: UploadScheam }]),
    ],
    controllers: [UploadController],
    providers: [UploadService, MulterConfigService],
    exports: [UploadService],
})
export class UploadModule {}
