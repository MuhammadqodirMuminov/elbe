import { Module, forwardRef } from '@nestjs/common';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { BranchesModule } from 'src/branches/branches.module';
import { DatabaseModule } from 'src/database/database.module';
import { ServicesModule } from 'src/services/services.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingDocument, bookingsSchema } from './models/booking.schema';

@Module({
    imports: [
        forwardRef(() => AppointmentModule),
        ServicesModule,
        BranchesModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            {
                name: BookingDocument.name,
                schema: bookingsSchema,
            },
        ]),
    ],
    controllers: [BookingsController],
    providers: [BookingsService],
    exports: [BookingsService],
})
export class BookingsModule {}
