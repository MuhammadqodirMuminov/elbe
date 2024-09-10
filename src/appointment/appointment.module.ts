import { Module, forwardRef } from '@nestjs/common';
import { BookingsModule } from 'src/bookings/bookings.module';
import { DatabaseModule } from 'src/database/database.module';
import { ServicesModule } from 'src/services/services.module';
import { AppointmentController } from './controllers/appointment.controller';
import { ContactController } from './controllers/contact.controller';
import { Appointment, appointmentSchema } from './models/appointment.schema';
import { ContactDocument, ContactSchema } from './models/contact.entity';
import { AppointmentService } from './services/appointment.service';
import { ContactService } from './services/contact.service';

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
            { name: ContactDocument.name, schema: ContactSchema },
        ]),
    ],
    controllers: [AppointmentController, ContactController],
    providers: [AppointmentService, ContactService],
    exports: [AppointmentService, ContactService],
})
export class AppointmentModule {}
