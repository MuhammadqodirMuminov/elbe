import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethods } from 'src/common';

export class CreatePaymentDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    address_id: string;

    @ApiProperty({ type: 'enum', enum: PaymentMethods, example: PaymentMethods.STRIPE })
    @IsEnum(PaymentMethods)
    @IsNotEmpty()
    payment_gateway: PaymentMethods;

    @ApiProperty({ type: 'string', required: true })
    @IsString()
    @IsNotEmpty()
    payment_method: string;
}
