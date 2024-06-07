import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentDocuemnt, PaymentSchema } from './models/payment.schema';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: PaymentDocuemnt.name, schema: PaymentSchema }])],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
