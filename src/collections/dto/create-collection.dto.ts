import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CollectionType } from 'src/common';

export class CreateCollectionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ type: 'enum', enum: CollectionType })
    @IsEnum(CollectionType)
    @IsNotEmpty()
    type: CollectionType;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    brand?: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    category?: string;
}
