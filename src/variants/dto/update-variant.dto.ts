import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { LengthType } from 'src/common';
import { Abttribute, ColorAttribute } from './create-variant.dto';

export class UpdateVariantDto {
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

    @ApiProperty({ type: String, required: true })
    @IsMongoId()
    @IsNotEmpty()
    productId: string;
}

export class UpdateAttributeDto extends PartialType(Abttribute) {}
export class UpdateColorDto extends PartialType(ColorAttribute) {}
