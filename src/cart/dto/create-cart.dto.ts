import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CartItemDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateCartDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @ApiProperty({ type: CartItemDto, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}

export class UpdateCartDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    variantId: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    size?: string;
}
