import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}

export class AppointmentQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsISO8601()
    date: Date;
}


