import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from './category.repository';
import { CategoryDocument, CategorySchema } from './models/category.schema';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([
            {
                name: CategoryDocument.name,
                schema: CategorySchema,
            },
        ]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoryRepository],
})
export class CategoriesModule {}
