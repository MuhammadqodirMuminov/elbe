import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VariantDto {
    @ApiProperty({ example: 'blue' })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: 'xl' })
    @IsNotEmpty()
    @IsString()
    size: string;

    @ApiProperty({ example: 2, required: false, description: 'this is optonal field' })
    @IsOptional()
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 4442, required: false, description: 'this field is optional id price is differance from main product price,Price is in cent' })
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty({ isArray: true, type: String, required: false, description: 'this field is optional' })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    images: string[];
}
