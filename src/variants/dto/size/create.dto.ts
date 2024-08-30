import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSizeDto {
    @ApiProperty({ description: 'Title of the size', example: 'Medium' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Values of the size', example: ['M', 'Medium'], type: [String] })
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    value: string[];

    @ApiPropertyOptional({ description: 'Size guide ID', example: '64f0a74e4e3e5f001d3c58b7' })
    @IsMongoId()
    @IsOptional()
    size_guide?: string;

    @ApiProperty({ description: 'Category ID', example: '64f0a74e4e3e5f001d3c58a2' })
    @IsMongoId()
    @IsNotEmpty()
    category: string;
}
