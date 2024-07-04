import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'src/upload/upload.module';
import { BrandsController } from './brands.controller';
import { BrandRepository } from './brands.repository';
import { BrandsService } from './brands.service';
import { BrandDocument, BrandSchema } from './models/brand.schema';

@Module({
    imports: [UploadModule, MongooseModule.forFeature([{ name: BrandDocument.name, schema: BrandSchema }])],
    controllers: [BrandsController],
    providers: [BrandsService, BrandRepository],
    exports: [BrandsService],
})
export class BrandsModule {}
