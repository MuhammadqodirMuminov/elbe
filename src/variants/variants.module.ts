import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { VariantDocument, VariantSchema } from './models/variant.schema';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: VariantDocument.name, schema: VariantSchema }])],
    controllers: [VariantsController],
    providers: [VariantsService],
    exports: [VariantsService],
})
export class VariantsModule {}
