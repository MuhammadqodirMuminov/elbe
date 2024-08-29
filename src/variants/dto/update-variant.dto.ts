import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Abttribute } from './create-variant.dto';

export class UpdateVariantDto {
    @ApiProperty({ type: String, isArray: true, required: false })
    @IsArray()
    @IsOptional()
    size: string[];

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
    @IsOptional()
    quantity: number;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    color: string;

    @ApiProperty({ type: String, required: false })
    @IsString()
    @IsOptional()
    length: string;
}

export class UpdateAttributeDto extends PartialType(Abttribute) {}
