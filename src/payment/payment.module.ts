import { Module, forwardRef } from '@nestjs/common';
import { AdressesModule } from 'src/adresses/adresses.module';
import { CartModule } from 'src/cart/cart.module';
import { DatabaseModule } from 'src/database/database.module';
import { OrdersModule } from 'src/orders/orders.module';
import { StripeModule } from './../stripe/stripe.module';
import { PaymentDocuemnt, PaymentSchema } from './models/payment.schema';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
    imports: [forwardRef(() => StripeModule), AdressesModule, CartModule, DatabaseModule, DatabaseModule.forFeature([{ name: PaymentDocuemnt.name, schema: PaymentSchema }]), OrdersModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
