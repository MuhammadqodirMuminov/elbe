import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { CartItemsDocument, CartItemsSchema } from 'src/cart/models/car-item.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsModule } from 'src/products/products.module';
import { VariantsModule } from 'src/variants/variants.module';
import { UsersModule } from './../auth/users/users.module';
import { OrderDocument, OrderSchama } from './models/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [
        VariantsModule,
        ProductsModule,
        CartModule,
        UsersModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: OrderDocument.name, schema: OrderSchama },
            { name: CartItemsDocument.name, schema: CartItemsSchema },
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
