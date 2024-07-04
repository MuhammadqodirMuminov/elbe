import { Module } from '@nestjs/common';
import { BrandsModule } from 'src/brands/brands.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { DatabaseModule } from 'src/database/database.module';
import { UploadModule } from 'src/upload/upload.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionDocument, CollectionSchema } from './models/collection.schema';

@Module({
    imports: [BrandsModule, CategoriesModule, UploadModule, DatabaseModule, DatabaseModule.forFeature([{ name: CollectionDocument.name, schema: CollectionSchema }])],
    controllers: [CollectionsController],
    providers: [CollectionsService],
    exports: [CollectionsService],
})
export class CollectionsModule {}
