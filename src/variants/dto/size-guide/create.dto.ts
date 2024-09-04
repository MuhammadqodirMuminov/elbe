import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSizeGuideDto {
    @ApiProperty({ description: 'Length ID', example: '64f0a74e4e3e5f001d3c58a9' })
    @IsMongoId()
    @IsNotEmpty()
    length: string;

    @ApiProperty({ description: 'Guide ID', example: '64f0a74e4e3e5f001d3c58b0' })
    @IsMongoId()
    @IsNotEmpty()
    guide: string;

    @ApiProperty({ description: 'Description for the size guide', required: false, example: 'Size guide of description' })
    @IsString()
    @IsOptional()
    description?: string;
}
