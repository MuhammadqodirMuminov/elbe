import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ForgotPasswordVerifyDto {
    @ApiProperty({
        description: 'This Field is for validate user is already has in out db',
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'muhammadqodirmuminov2@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456Aa@' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: '123456Aa@' })
    @IsNotEmpty()
    confirmPassword: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
