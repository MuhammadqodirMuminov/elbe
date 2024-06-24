import { ApiProperty } from '@nestjs/swagger'; // Optional for API documentation
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'The name of the category (required, unique)' })
    @IsString()
    @Length(1, 255)
    name: string;

    @ApiProperty({
        description: 'Optional reference ID to the parent category',
    })
    @IsOptional()
    @IsString()
    parent_id?: string;

    @ApiProperty({
        description: 'Flag indicating if the category is active (default: false)',
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'Optional description of the category' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    image: string;
}
