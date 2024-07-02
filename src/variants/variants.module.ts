import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductDocument, ProductSchema } from 'src/products/models/product.schema';
import { ProductsModule } from 'src/products/products.module';
import { UploadModule } from 'src/upload/upload.module';
import { VariantDocument, VariantSchema } from './models/variant.schema';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

@Module({
    imports: [
        forwardRef(() => ProductsModule),
        UploadModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: VariantDocument.name, schema: VariantSchema },
            { name: ProductDocument.name, schema: ProductSchema },
        ]),
    ],
    controllers: [VariantsController],
    providers: [VariantsService],
    exports: [VariantsService],
})
export class VariantsModule {}
