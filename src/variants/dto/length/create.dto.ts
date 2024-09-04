import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLengthDto {
    @ApiProperty({ description: 'Key for the length', required: true, example: 'medium' })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({ description: 'Value for the length', required: true, example: '150cm' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ description: 'Description for the length', required: false, example: 'Length of description' })
    @IsString()
    @IsOptional()
    description?: string;
}
