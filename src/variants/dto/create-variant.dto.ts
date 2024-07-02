import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVariantDto {
    @ApiProperty({ type: Object, example: { add1: 'add', add2: 'add' } })
    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty()
    @IsNotEmpty()
    size: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ type: [Types.ObjectId], required: true, isArray: true })
    @IsArray()
    images: String[];

    @ApiProperty({ type: String, required: true })
    @IsMongoId()
    @IsNotEmpty()
    productId: string;
}

export class AddImageDto {
    @ApiProperty({ type: [Types.ObjectId], required: true, isArray: true })
    @IsArray()
    images: string[];
}
