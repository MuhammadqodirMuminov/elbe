import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ROLES, USER_STATUS } from 'src/auth/interface/auth.interface';

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstname?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiProperty()
    @IsEnum(ROLES)
    @IsOptional()
    role?: ROLES;

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone?: string;

    status?: USER_STATUS;
}
