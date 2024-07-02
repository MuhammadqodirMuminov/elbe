import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VariantDto {
    @ApiProperty({ example: 'blue' })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ isArray: true, example: ['xl'] })
    @IsNotEmpty()
    @IsArray()
    size: string[];

    @ApiProperty({ example: 4442, required: false, description: 'this field is optional id price is differance from main product price,Price is in cent', default: 0 })
    @IsOptional()
    @IsNumber()
    price?: number;
}
