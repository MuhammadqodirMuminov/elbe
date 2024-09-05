import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    userName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsISO8601()
    date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    appointmentId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    branchId: string;
}
