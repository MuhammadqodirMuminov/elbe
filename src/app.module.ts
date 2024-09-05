import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { AdressesModule } from './adresses/adresses.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { CollectionsModule } from './collections/collections.module';
import { DatabaseModule } from './database/database.module';
import { DiscountsModule } from './discounts/discounts.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StripeModule } from './stripe/stripe.module';
import { UploadModule } from './upload/upload.module';
import { VariantsModule } from './variants/variants.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { GiftsModule } from './gifts/gifts.module';
import { AppointmentModule } from './appointment/appointment.module';
import { BranchesModule } from './branches/branches.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

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
    ],
})
export class AppModule {}
