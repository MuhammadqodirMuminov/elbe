import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductDocument, ProductSchema } from 'src/products/models/product.schema';
import { UploadModule } from 'src/upload/upload.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from './category.repository';
import { CategoryDocument, CategorySchema } from './models/category.schema';

@Module({
    imports: [
        UploadModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            {
                name: CategoryDocument.name,
                schema: CategorySchema,
            },
            {
                name: ProductDocument.name,
                schema: ProductSchema,
            },
        ]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoryRepository],
    exports: [CategoryRepository, CategoriesService],
})
export class CategoriesModule {}
