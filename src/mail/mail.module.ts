import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserDocument, UserSchema } from 'src/auth/users/models/user.schema';
import { DatabaseModule } from 'src/database/database.module';
import { BanRepository } from './ban.repository';
import { MailRepository } from './mail.repository';
import { MailService } from './mail.service';
import { BanDocument, BanSchema } from './models/ban.schema';
import { OtpDocument, OtpSchema } from './models/mail.schema';
import { TokenDocument, TokenSchema } from './models/token.schema';

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
    ],
    providers: [MailService, MailRepository, BanRepository],
    exports: [MailService, MailRepository],
})
export class MailModule {}
