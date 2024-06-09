import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    user: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    product: string;

    @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ example: 'Great product!', required: false })
    @IsOptional()
    @IsString()
    comment: string;
}
