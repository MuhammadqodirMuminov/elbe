import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Muhammadqodir' })
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiProperty({ example: 'Mominov' })
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty({ example: 'muhammadqodirmuminov2@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '12345678' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

export class VerifyDto {
    @ApiProperty({ example: 'muhammadqodirmuminov2@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '12344' })
    @IsString()
    @IsNotEmpty()
    confirmCode: string;
}
