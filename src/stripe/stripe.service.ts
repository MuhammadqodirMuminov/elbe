import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentStatus } from 'src/common';
import { OrdersService } from 'src/orders/orders.service';
import { PaymentService } from 'src/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    client: Stripe;
    constructor(
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
        private readonly orderService: OrdersService,
    ) {
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        this.client = new Stripe(secretKey);
    }

    async config() {
        const pkey = await this.configService.get('STRIPE_PUBLIC_KEY');
        return { publishableKey: pkey };
    }

    async createPaymentIntent(amount: number, payment_method: string) {
        const paymentIntent = await this.client.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: [payment_method],
        });

        return paymentIntent;
    }

    async paymentIntentWebhook(event: Stripe.Event, headers: Record<string, string>) {
        const sig = headers['stripe-signature'];
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

        try {
            event = this.client.webhooks.constructEvent(event as any, sig, webhookSecret);
        } catch (err) {
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }

        if (!['payment_intent.succeeded', 'payment_intent.canceled', 'payment_intent.payment_failed'].includes(event.type)) {
            return;
        }
        const data = event.data.object as Stripe.PaymentIntent;

        const payment = await this.paymentService.getPaymentByTransactionId(data.id);

        const order = await this.orderService.getOrderById(payment?.order_id.toString());

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.orderService.afterPaymentConcluded(order, OrderStatus.SUCCEEDED, payment);
                payment.paymentStatus = PaymentStatus.DONE;
                await payment.save();
                break;
            case 'payment_intent.canceled':
                payment.paymentStatus = PaymentStatus.CANCELED;
                await payment.save();
                break;
            case 'payment_intent.payment_failed':
                payment.paymentStatus = PaymentStatus.FAILED;
                await payment.save();
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }

    async cancelIntent(id: string) {
        return await this.client.paymentIntents.cancel(id);
    }
}
