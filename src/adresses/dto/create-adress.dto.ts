import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, MaxLength } from 'class-validator';

export class CreateAdressDto {
    @ApiProperty({ example: 'Deepak' })
    @IsString({ always: true })
    @MaxLength(255, { always: true })
    first_name: string;

    @ApiProperty({ example: 'Mandal' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    last_name: string;

    @ApiProperty({ example: 'Home' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    name: string;

    @ApiProperty({ example: 'John Does Road' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    address: string;

    @ApiProperty({ example: 'Nagpur' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    city: string;

    @ApiProperty({ example: 'Maharashtra' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    state: string;

    @ApiProperty({ example: 'India' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    country: string;

    @ApiProperty({ example: '469479' })
    @MaxLength(255, { always: true })
    @IsString({ always: true })
    zip_code: string;

    @ApiProperty()
    @IsMongoId()
    customerId: string;
}
