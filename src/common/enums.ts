export enum PaymentMethods {
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
    CASH = 'CASH',
    APPLE_PAY = 'APPLE_PAY',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export enum OrderStatus {
    PLACED = 'PLACED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
}

export enum PayOptions {
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
}
