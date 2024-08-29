import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { LengthType } from 'src/common';

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

export class ColorAttribute {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ example: 1, type: Number })
    @IsNumber()
    priority: number;

    @ApiProperty()
    @IsString()
    value: string;
}

export class CreateVariantDto {
    @ApiProperty({ type: Abttribute, isArray: true })
    @IsArray()
    @IsOptional()
    attributes?: Abttribute[];

    @ApiProperty({ type: ColorAttribute, isArray: true })
    @IsArray()
    color: ColorAttribute[];

    @ApiProperty({ type: 'enum', enum: LengthType, example: LengthType.LONG })
    @IsEnum(LengthType)
    lenth: LengthType;

    @ApiProperty()
    @IsNotEmpty()
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
