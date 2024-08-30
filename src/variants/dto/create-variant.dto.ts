import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class Abttribute {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ example: 1, type: Number })
    @IsNumber()
    priority: number;

    @ApiProperty({ type: String, isArray: true })
    @IsArray()
    value: string[];
}

export class CreateVariantDto {
    @ApiProperty({ type: Abttribute, isArray: true })
    @IsArray()
    @IsOptional()
    attributes?: Abttribute[];

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    color: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    length: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    size: string;

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
