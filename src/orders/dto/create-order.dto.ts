import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentMethods } from 'src/common';

class ProductDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    color?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    size?: string;
}

class AddressDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    street?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    zip?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string;
}

export class CreateOrderDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @ApiProperty({ type: ProductDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @ApiProperty({ type: AddressDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress?: AddressDto;

    @ApiProperty({ type: AddressDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    billingAddress?: AddressDto;

    @ApiProperty({ type: 'enum', enum: PaymentMethods, example: PaymentMethods.STRIPE })
    @IsEnum(PaymentMethods)
    @IsNotEmpty()
    paymentMethod: PaymentMethods;

    @ApiProperty({ type: Types.ObjectId, isArray: true })
    @IsOptional()
    @IsArray()
    appliedDiscounts?: string[];

    // @ApiProperty()
    // @IsOptional()
    // @IsMongoId()
    // deliveryOption?: string;
}

import { OrderStatus, PaymentStatus } from 'src/common';

export class UpdateOrderStatusDto {
    @ApiProperty({ type: 'enum', enum: OrderStatus, example: OrderStatus.PLACED })
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    shippingStatus: OrderStatus;

    @ApiProperty({ type: 'enum', enum: PaymentStatus, example: PaymentStatus.PENDING })
    @IsEnum(PaymentStatus)
    @IsNotEmpty()
    paymentStatus: PaymentStatus;
}
