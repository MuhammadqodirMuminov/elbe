import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { CartDocument, CartSchema } from './models/cart.schema';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: CartDocument.name, schema: CartSchema }])],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService, CartRepository],
})
export class CartModule {}
