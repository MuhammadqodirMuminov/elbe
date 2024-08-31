import { Module, forwardRef } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { DatabaseModule } from 'src/database/database.module';
import { ProductDocument, ProductSchema } from 'src/products/models/product.schema';
import { ProductsModule } from 'src/products/products.module';
import { UploadModule } from 'src/upload/upload.module';
import { ColorController } from './controllers/color.controller';
import { LengthController } from './controllers/length.controller';
import { SizeGuideController } from './controllers/size-guide.controller';
import { SizesController } from './controllers/sizes.controller';
import { VariantsController } from './controllers/variants.controller';
import { ColorDocument, colorSchema } from './models/color.schema';
import { LengthDocument, lengthSchema } from './models/length.schema';
import { SizeGuideDocument, sizeGuideSchema } from './models/size-guide.schema';
import { SizesDocument, sizesSchema } from './models/sizes.schema';
import { VariantDocument, VariantSchema } from './models/variant.schema';
import { ColorService } from './services/color.service';
import { LengthService } from './services/length.service';
import { SizeGuideService } from './services/size-guide.service';
import { SizesService } from './services/sizes.service';
import { VariantsService } from './services/variants.service';

@Module({
    imports: [
        forwardRef(() => ProductsModule),
        CategoriesModule,
        UploadModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: VariantDocument.name, schema: VariantSchema },
            { name: ProductDocument.name, schema: ProductSchema },
            { name: ColorDocument.name, schema: colorSchema },
            { name: LengthDocument.name, schema: lengthSchema },
            { name: SizesDocument.name, schema: sizesSchema },
            { name: SizeGuideDocument.name, schema: sizeGuideSchema },
        ]),
    ],
    controllers: [VariantsController, ColorController, LengthController, SizesController, SizeGuideController],
    providers: [VariantsService, ColorService, LengthService, SizesService, SizeGuideService],
    exports: [VariantsService, ColorService, LengthService, SizesService, SizeGuideService],
})
export class VariantsModule {}
