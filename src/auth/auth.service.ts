import { BadGatewayException, BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Types } from 'mongoose';
import { RandomCodeGenerate, comparePassword, hashPassword } from 'src/common';
import { MailService } from './../mail/mail.service';
import { ForgotPasswordDto, ForgotPasswordVerifyDto, ResetPasswordDto } from './dto/password.dto';
import { RegisterDto, VerifyDto } from './dto/register.dto';
import { ROLES, USER_STATUS } from './interface/auth.interface';
import { UserDocument } from './users/models/user.schema';
import { UsersService } from './users/users.service';

export interface TokenPayload {
    userId: Types.ObjectId;
    role: ROLES;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly usersService: UsersService,
    ) {}

    async register(registerDto: RegisterDto) {
        const code = RandomCodeGenerate();

        await this.validateRegisterData(registerDto.email);
        const existUser = await this.usersService.findWithQuery({ email: registerDto.email, status: USER_STATUS.PENDING });

        const attepmt = await this.mailService.attepmt({
            email: registerDto.email,
            code: +code,
        });

        await this.mailService.sendOtp(registerDto.email, String(code));

        if (!existUser) {
            await this.usersService.createUser({
                ...registerDto,
                role: ROLES.USER,
                status: USER_STATUS.PENDING,
            });
        }

        return {
            message: 'Confirmation code was successfully send',
            success: attepmt,
        };
    }

    async verify({ email, confirmCode }: VerifyDto, response: Response) {
        await this.mailService.verifyOtp(email, confirmCode);

        const userExist = await this.usersService.getUser({ email });

        const user = await this.usersService.update(userExist._id, {
            status: USER_STATUS.ACTIVE,
        });

        const tokenPayload: TokenPayload = {
            userId: user._id,
            role: user.role,
        };

        const expires = this.setExpires();

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires,
        });

        delete user.password;

        return response.send(user);
    }

    async login(user: UserDocument, response: Response) {
        const tokenPayload: TokenPayload = {
            userId: user._id,
            role: user.role,
        };

        const expires = this.setExpires();

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires,
        });
    }

    async logout(response: Response) {
        response.cookie('Authentication', '', {
            httpOnly: true,
            expires: new Date(),
        });
    }

    async forgotPassword({ email }: ForgotPasswordDto) {
        const secureToken = await this.mailService.generateToken(email);

        const token = await this.mailService.sendSecureToken(email, secureToken);

        return {
            message: 'Verfication link is sent to your email address',
            token: secureToken,
            success: token,
        };
    }

    async forgotPasswordVerification({ email, token, password, confirmPassword }: ForgotPasswordVerifyDto) {
        const user = await this.usersService.getUser({ email });

        const isValidToken = await this.mailService.verifyToken(token, email);
        if (!isValidToken) throw new UnprocessableEntityException('Invalid secure - token');

        if (password !== confirmPassword) throw new BadGatewayException('Passwords does not match!');

        const hashedPassword = await hashPassword(password);
        await this.usersService.update(user._id.toString(), {
            password: hashedPassword,
        });
        return {
            success: true,
            message: 'Password changed successfully',
        };
    }

    protected setExpires(): Date {
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
        return expires;
    }

    async resetPassword(user: UserDocument, resetPasswordDto: ResetPasswordDto) {
        const comparePasswords = await comparePassword(user.password, resetPasswordDto.oldPassword);
        if (!comparePasswords) throw new BadRequestException('Passwords do not match');

        const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

        await this.usersService.update(user._id.toString(), {
            password: hashedPassword,
        });

        return {
            success: true,
            message: 'Password updated successfully',
        };
    }

    async validateRegisterData(email: string) {
        const existUser = await this.usersService.findWithQuery({ email, status: USER_STATUS.ACTIVE });
        if (existUser) throw new BadRequestException('User already exists with this email, please login');
        return true;
    }

    async me(user: UserDocument) {
        try {
            const existUser = await this.usersService.findWithQuery({ email: user.email, status: USER_STATUS.ACTIVE });
            return existUser;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }
}
