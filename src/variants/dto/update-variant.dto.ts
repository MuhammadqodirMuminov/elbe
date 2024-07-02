import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateVariantDto {
    @ApiProperty({ type: Object, example: { add1: 'add', add2: 'add' } })
    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty()
    @IsOptional()
    size?: string;

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
    @IsOptional()
    quantity: number;

    @ApiProperty({ type: String, required: true })
    @IsMongoId()
    @IsOptional()
    productId?: string;
}
