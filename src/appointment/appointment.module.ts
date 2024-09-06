import { Module, forwardRef } from '@nestjs/common';
import { BookingsModule } from 'src/bookings/bookings.module';
import { DatabaseModule } from 'src/database/database.module';
import { ServicesModule } from 'src/services/services.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, appointmentSchema } from './models/appointment.schema';

@Module({
    imports: [
        forwardRef(() => BookingsModule),
        DatabaseModule,
        ServicesModule,
        DatabaseModule.forFeature([
            {
                name: Appointment.name,
                schema: appointmentSchema,
            },
        ]),
    ],
    controllers: [AppointmentController],
    providers: [AppointmentService],
    exports: [AppointmentService],
})
export class AppointmentModule {}
