import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserDocument, UserSchema } from 'src/auth/users/models/user.schema';
import { DatabaseModule } from 'src/database/database.module';
import { BanDocument, BanSchema } from './models/ban.schema';
import { OtpDocument, OtpSchema } from './models/mail.schema';
import { TokenDocument, TokenSchema } from './models/token.schema';
import { BanRepository } from './repositories/ban.repository';
import { MailRepository } from './repositories/mail.repository';
import { MailService } from './services/mail.service';
import { MailSendService } from './services/mailer.service';
import { TestEmailController } from './test.controller';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            {
                name: OtpDocument.name,
                schema: OtpSchema,
            },
            {
                name: BanDocument.name,
                schema: BanSchema,
            },
            {
                name: TokenDocument.name,
                schema: TokenSchema,
            },
            {
                name: UserDocument.name,
                schema: UserSchema,
            },
        ]),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, '/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [TestEmailController],
    providers: [MailService, MailRepository, BanRepository, MailSendService],
    exports: [MailService, MailRepository, MailSendService],
})
export class MailModule {}
