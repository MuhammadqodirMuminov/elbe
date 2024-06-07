import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDiscountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expiryDate?: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    applicableTo?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableProducts?: Types.ObjectId[];

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableCategories?: Types.ObjectId[];

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    minimumOrderValue?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    freeDeliveryMinimumOrderValue?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    referFriendDiscountPercentage?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    studentDiscountPercentage?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    giftCardValue?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    eGiftCardValue?: number;
}
