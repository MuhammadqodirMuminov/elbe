import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as SendGrid from '@sendgrid/mail';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { compareHashString, comparePassword, createHashString, hashPassword, resetPasswordUrl } from 'src/common';
import { BanRepository } from './ban.repository';
import { AttempDto } from './dto/attempt.dto';
import { MailRepository } from './mail.repository';
import { BanDocument } from './models/ban.schema';
import { OtpDocument } from './models/mail.schema';
import { TokenDocument } from './models/token.schema';

@Injectable()
export class MailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly smsRepository: MailRepository,
        @InjectModel(OtpDocument.name) private otpModel: Model<OtpDocument>,
        private readonly banRepository: BanRepository,
        @InjectModel(BanDocument.name) private banModel: Model<BanDocument>,
        @InjectModel(TokenDocument.name)
        private tokenModel: Model<TokenDocument>,
        @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    ) {
        SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    }

    async sendOtp(email: string, code: string): Promise<boolean> {
        try {
            if (!email) throw new ForbiddenException('Email is required.');

            const emailData = {
                to: email,
                subject: 'Email Verification',
                from: 'muminovmuhammadqodir0@gmail.com',
                text: 'Verify your email end enjoy free courses.',
                html: `<h1>Verifivation code : ${code} </h1>`,
            };

            await SendGrid.send(emailData);

            return true;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async attepmt({ email, code }: AttempDto): Promise<boolean> {
        try {
            const hashedCode = await hashPassword(String(code));

            const attempts = await this.otpModel.findOne({ email });

            if (attempts) {
                if (attempts.attempt > 5) {
                    // find the user from banned users
                    const bannedUser = await this.banModel.findOne({
                        email,
                    });

                    if (bannedUser) {
                        // if the user is exist check the ban time
                        if (bannedUser.ban_time < new Date()) {
                            // ban time is epire remove from ban table and update attems to 1
                            await this.banRepository.findOneAndDelete(bannedUser?._id);
                            await this.smsRepository.fundOneAndUpdate(attempts._id, {
                                attempt: 1,
                                code: hashedCode,
                            });

                            // return true
                            return true;
                        }

                        throw new ForbiddenException('Someting went wrong please try again later');
                    } else {
                        // ban the user

                        await this.banRepository.create({
                            email,
                            ban_time: new Date(Date.now() + 300000),
                        });

                        throw new ForbiddenException('Someting went wrong please try again later');
                    }
                }

                await this.smsRepository.fundOneAndUpdate(attempts._id, {
                    attempt: attempts.attempt + 1,
                    code: hashedCode,
                });

                return true;
            }

            await this.smsRepository.create({
                attempt: attempts?.attempt ? attempts.attempt + 1 : 1,
                code: hashedCode,
                email: email,
                expire_date: new Date(Date.now() + 120000),
            });

            return true;
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async verifyOtp(email: string, otpVerification: string): Promise<boolean> {
        const existUserOtp = await this.otpModel.findOne({ email });

        if (existUserOtp) {
            const { expire_date, code } = existUserOtp;

            if (expire_date < new Date()) {
                await this.otpModel.deleteMany({ email });
                throw new BadRequestException('Your code is expired. please resend it');
            }
            const validOtp = await comparePassword(code.toString(), otpVerification);
            if (!validOtp) throw new BadRequestException('Your code is not valid. please check your email or try again');

            await this.otpModel.deleteMany({ email });
            return true;
        } else {
            throw new NotFoundException('Otp verification code not found');
        }
    }

    async generateToken(email: string): Promise<string> {
        const existToken = await this.tokenModel.findOne({ email });

        if (existToken) {
            await this.tokenModel.deleteMany({ email });
        }

        const { token, expirationTime, hashedToken } = await createHashString();

        await this.tokenModel.create({
            _id: new Types.ObjectId(),
            hash_token: hashedToken,
            expire_date: expirationTime,
            email: email,
        });

        return token;
    }

    async verifyToken(token: string, email: string): Promise<boolean> {
        const tokenHashed = await this.tokenModel.findOne({ email });

        if (tokenHashed) {
            const matchtoken = await compareHashString(token, tokenHashed.hash_token);

            if (!matchtoken) throw new BadRequestException('Invalid token');

            if (tokenHashed.expire_date < new Date()) {
                await this.tokenModel.deleteMany({ email });
                throw new BadRequestException('Token time is expired.');
            }

            await this.tokenModel.deleteMany({ email });

            return true;
        } else {
            throw new BadRequestException('token not found');
        }
    }

    async sendSecureToken(email: string, token: string) {
        try {
            if (!email) throw new ForbiddenException('Email is required.');

            const emailData = {
                to: email,
                subject: 'Email Verification',
                from: 'muminovmuhammadqodir0@gmail.com',
                text: 'Verify your email end enjoy free courses.',
                html: `<h1>To reset your password  press  the  👉${resetPasswordUrl + `?token=` + token} </h1>`,
            };

            await SendGrid.send(emailData);

            return true;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
