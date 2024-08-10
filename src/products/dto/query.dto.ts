import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ProductSortTypes } from 'src/common';

export class QueryProductDto {
    @ApiProperty({ type: String, required: false, isArray: true })
    @IsOptional()
    @IsString({ each: true })
    categoryId?: string[] | string;

    @ApiProperty({ type: String, required: false, isArray: true })
    @IsOptional()
    @IsString({ each: true })
    size?: string[] | string;

    @ApiProperty({ type: String, required: false, isArray: true })
    @IsOptional()
    @IsString({ each: true })
    color?: string[] | string;

    @ApiProperty({ type: String, required: false, isArray: true })
    @IsOptional()
    @IsString({ each: true })
    brandId?: string[] | string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    minPrice?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    maxPrice?: string;

    @ApiProperty({ type: 'enum', enum: ProductSortTypes, example: ProductSortTypes.NEWEST, required: false })
    @IsOptional()
    @IsEnum(ProductSortTypes)
    sortBy?: ProductSortTypes;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, example: '1' })
    @IsOptional()
    @IsNumberString()
    page?: string;

    @ApiProperty({ required: false, example: '10' })
    @IsOptional()
    @IsNumberString()
    limit?: string;
}
