import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryProductDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, example: '1' })
    @IsOptional()
    @IsNumberString()
    page?: string;

    @ApiProperty({ required: false, example: '10' })
    @IsOptional()
    @IsNumberString()
    limit?: string;
}
