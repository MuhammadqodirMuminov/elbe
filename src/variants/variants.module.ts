import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductDocument, ProductSchema } from 'src/products/models/product.schema';
import { ProductsModule } from 'src/products/products.module';
import { UploadModule } from 'src/upload/upload.module';
import { ColorController } from './controllers/color.controller';
import { LengthController } from './controllers/length.controller';
import { VariantsController } from './controllers/variants.controller';
import { ColorDocument, colorSchema } from './models/color.schema';
import { LengthDocument, lengthSchema } from './models/length.schema';
import { VariantDocument, VariantSchema } from './models/variant.schema';
import { ColorService } from './services/color.service';
import { LengthService } from './services/length.service';
import { VariantsService } from './services/variants.service';

@Module({
    imports: [
        forwardRef(() => ProductsModule),
        UploadModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: VariantDocument.name, schema: VariantSchema },
            { name: ProductDocument.name, schema: ProductSchema },
            { name: ColorDocument.name, schema: colorSchema },
            { name: LengthDocument.name, schema: lengthSchema },
        ]),
    ],
    controllers: [VariantsController, ColorController, LengthController],
    providers: [VariantsService, ColorService, LengthService],
    exports: [VariantsService, ColorService, LengthService],
})
export class VariantsModule {}
