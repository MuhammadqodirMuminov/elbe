import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsModule } from 'src/products/products.module';
import { VariantsModule } from 'src/variants/variants.module';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { CartItemsDocument, CartItemsSchema } from './models/car-item.schema';
import { CartDocument, CartSchema } from './models/cart.schema';

@Module({
    imports: [
        forwardRef(() => ProductsModule),
        VariantsModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: CartDocument.name, schema: CartSchema },
            { name: CartItemsDocument.name, schema: CartItemsSchema },
        ]),
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService],
})
export class CartModule {}
