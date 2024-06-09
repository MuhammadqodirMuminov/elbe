import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { DiscountsModule } from './discounts/discounts.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [
        PinoLoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                    },
                },
            },
        }),
        DatabaseModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.string().required(),
                MONGODB_URI: Joi.string().required(),
                PORT: Joi.number().required(),
                SENDGRID_API_KEY: Joi.string().required(),
            }),
        }),

        MailModule,
        CategoriesModule,
        UploadModule,
        ProductsModule,
        CartModule,
        OrdersModule,
        PaymentModule,
        DiscountsModule,
        ReviewsModule,
    ],
})
export class AppModule {}
