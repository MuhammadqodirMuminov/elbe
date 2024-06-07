import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DiscountController } from './discounts.controller';
import { DiscountService } from './discounts.service';
import { Discount, DiscountSchema } from './models/discount.schema';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }])],
    controllers: [DiscountController],
    providers: [DiscountService],
})
export class DiscountsModule {}
