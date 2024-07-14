import { Controller, Get, Headers, Post, RawBody } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')
@Controller()
export class StripeController {
    constructor(private service: StripeService) {}

    @Get('stripe/config')
    async stripeConfig() {
        return await this.service.config()
    }

    @Post('/webhook')
    async getAll(@RawBody() body: any, @Headers() headers: Record<string, string>) {
        return this.service.paymentIntentWebhook(body, headers);
    }
}
