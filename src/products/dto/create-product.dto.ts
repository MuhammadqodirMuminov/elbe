import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
    @ApiProperty({ example: 'BROWN BLUE ' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Article is devoted division of the technical and conceptual description of the dress, corresponding in the first case - to the clothes description, and in the second case - to the description of a conceptual component of' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 1000, description: 'Price is cent' })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsMongoId()
    category: Types.ObjectId;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsMongoId()
    brand: Types.ObjectId;

    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    image: string;
}
