import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { resetPasswordUrl } from 'src/common';

@Injectable()
export class MailSendService {
    constructor(private readonly mailerService: MailerService) {}

    async sendOtp(email: string, code: string): Promise<boolean> {
        try {
            if (!email) throw new ForbiddenException('Email is required.');

            await this.mailerService.sendMail({
                to: email,
                subject: 'Your Elbe Menswear Verification Code',
                template: './registration',
                context: { code, name: email },
            });

            return true;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async sendSecureToken(email: string, token: string) {
        try {
            if (!email) throw new ForbiddenException('Email is required.');
            const url = resetPasswordUrl + `?token=` + token;

            await this.mailerService.sendMail({
                to: email,
                subject: 'Reset Your Elbe Menswear Account Password',
                template: './secureToken',
                context: { name: email, url },
            });

            return true;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
