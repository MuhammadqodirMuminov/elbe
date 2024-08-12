import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({ type: Boolean, required: false, example: true })
    @IsOptional()
    @IsBoolean()
    isOnOffer?: boolean;
}
