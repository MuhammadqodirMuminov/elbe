export enum PaymentMethods {
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL',
    CASH = 'CASH',
    APPLE_PAY = 'APPLE_PAY',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    DONE = 'DONE',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED',
}

export enum OrderStatus {
    CREATED = 'CREATED',
    SUCCEEDED = 'SUCCEEDED',
    CANCELED = 'CANCELED',
}

export enum PayOptions {
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
}

export enum CollectionType {
    BRAND = 'BRAND',
    CATEGORY = 'CATEGORY',
}
