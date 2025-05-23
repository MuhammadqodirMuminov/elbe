import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    productId: string;
}
