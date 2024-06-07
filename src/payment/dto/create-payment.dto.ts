import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PaymentMethods } from 'src/common';

export class CreatePaymentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    order: string;

    @ApiProperty({ type: 'enum', enum: PaymentMethods, example: PaymentMethods.STRIPE })
    @IsNotEmpty()
    @IsString()
    paymentGateway: PaymentMethods;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    paymentDate: Date;

    @ApiProperty({ type: Object })
    @IsOptional()
    @IsObject()
    details?: Record<string, any>;
}
