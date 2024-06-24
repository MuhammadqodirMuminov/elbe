import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLES, USER_STATUS } from 'src/auth/interface/auth.interface';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    firstname: string;

    @ApiProperty()
    @IsString()
    lastname: string;

    @ApiProperty()
    @IsEnum(ROLES)
    @IsNotEmpty()
    role: ROLES;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    avatar: string;

    status: USER_STATUS;
}
