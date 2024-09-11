import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { AdressesModule } from './adresses/adresses.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { BranchesModule } from './branches/branches.module';
import { BrandsModule } from './brands/brands.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatBotModule } from './chat-bot/chat-bot.module';
import { CollectionsModule } from './collections/collections.module';
import { DatabaseModule } from './database/database.module';
import { DiscountsModule } from './discounts/discounts.module';
import { GiftsModule } from './gifts/gifts.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServicesModule } from './services/services.module';
import { StripeModule } from './stripe/stripe.module';
import { UploadModule } from './upload/upload.module';
import { VariantsModule } from './variants/variants.module';
import { WishlistsModule } from './wishlists/wishlists.module';

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
        AdressesModule,
        VariantsModule,
        BrandsModule,
        CollectionsModule,
        StripeModule,
        WishlistsModule,
        GiftsModule,
        AppointmentModule,
        BranchesModule,
        ServicesModule,
        BookingsModule,
        ChatBotModule,
    ],
})
export class AppModule {}
