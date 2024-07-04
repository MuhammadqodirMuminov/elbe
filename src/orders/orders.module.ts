import { Module } from '@nestjs/common';
import { UsersModule } from 'src/auth/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { Order, OrderSchema } from './models/order.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), UsersModule],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
