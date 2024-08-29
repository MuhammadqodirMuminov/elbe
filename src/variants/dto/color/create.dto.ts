import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateColorDto {
    @ApiProperty({ description: 'Title of the color', required: false, example: 'Red' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ description: 'Priority of the color', example: 1, required: true })
    @IsNumber()
    @Min(1)
    priority: number;

    @ApiProperty({ description: 'Primary value of the color', required: true, example: '#FFFFFF' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ description: 'Secondary value of the color', required: false, example: '#000000' })
    @IsString()
    @IsOptional()
    value2?: string;
}
