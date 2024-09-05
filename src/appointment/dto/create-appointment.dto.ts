import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    time: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    desription: string;

    @ApiProperty({ type: String, isArray: true })
    @IsArray()
    service: string[];
}
