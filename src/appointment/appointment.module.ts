import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ServicesModule } from 'src/services/services.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment, appointmentSchema } from './models/appointment.schema';

@Module({
    imports: [
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
