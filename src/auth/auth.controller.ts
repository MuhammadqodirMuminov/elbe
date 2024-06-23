import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto, SentOtpDto } from './dto/login.dto';
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
    async verify(@Body() verifyDto: VerifyDto) {
        return await this.authService.verify(verifyDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto, @CurrentUser() user: UserDocument) {
        return await this.authService.login(user);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('forgot-password-verification')
    async forgotPasswordVerification(@Body() forgotPasswordVerifyDto: ForgotPasswordVerifyDto) {
        return await this.authService.forgotPasswordVerification(forgotPasswordVerifyDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async resetPassword(@CurrentUser() user: UserDocument, @Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(user, resetPasswordDto);
    }

    @Post('send-otp')
    async sentOtp(@Body() body: SentOtpDto) {
        return await this.authService.sentOtp(body);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: UserDocument) {
        return await this.authService.me(user);
    }
}
