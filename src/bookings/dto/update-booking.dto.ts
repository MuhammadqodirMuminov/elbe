import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}

export class BookingsQuery {
    @ApiProperty({ example: '2024-09-10', required: false })
    @IsString()
    @IsOptional()
    startDate: string;

    @ApiProperty({ example: '2024-09-11', required: false })
    @IsString()
    @IsOptional()
    endDate: string;
}
