import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ForgotPasswordVerifyDto, ResetPasswordDto } from './dto/password.dto';
import { RegisterDto, VerifyDto } from './dto/register.dto';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './users/models/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post('verify')
    async verify(@Body() verifyDto: VerifyDto, @Res({ passthrough: true }) response: Response) {
        return await this.authService.verify(verifyDto, response);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto, @CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
        await this.authService.login(user, response);
        response.send(user);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
        return await this.authService.logout(response);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('forgot-password-verification')
    async forgotPasswordVerification(@Body() forgotPasswordVerifyDto: ForgotPasswordVerifyDto) {
        return await this.authService.forgotPasswordVerification(forgotPasswordVerifyDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async resetPassword(@CurrentUser() user: UserDocument, @Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(user, resetPasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: UserDocument) {
        return await this.authService.me(user);
    }
}
