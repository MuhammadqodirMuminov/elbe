import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLengthDto {
    @ApiProperty({ description: 'Key for the length', required: true, example: 'medium' })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({ description: 'Value for the length', required: true, example: '150cm' })
    @IsString()
    @IsNotEmpty()
    value: string;
}
