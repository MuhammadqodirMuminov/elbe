import { Module, forwardRef } from '@nestjs/common';
import { BrandsModule } from 'src/brands/brands.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoryDocument, CategorySchema } from 'src/categories/models/category.schema';
import { CollectionsModule } from 'src/collections/collections.module';
import { DatabaseModule } from 'src/database/database.module';
import { UploadModule } from 'src/upload/upload.module';
import { VariantDocument, VariantSchema } from 'src/variants/models/variant.schema';
import { VariantsModule } from 'src/variants/variants.module';
import { WishlistsModule } from 'src/wishlists/wishlists.module';
import { ProductDocument, ProductSchema } from './models/product.schema';
import { ProductsController } from './products.controller';
import { ProductRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
    imports: [
        CollectionsModule,
        BrandsModule,
        UploadModule,
        CategoriesModule,
        forwardRef(() => WishlistsModule),
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: ProductDocument.name, schema: ProductSchema },
            { name: CategoryDocument.name, schema: CategorySchema },
            { name: VariantDocument.name, schema: VariantSchema },
        ]),
        forwardRef(() => VariantsModule),
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductRepository],
    exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
