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

export enum ProductSortTypes {
    NEWEST = 'NEWEST',
    CHEAPEST = 'CHEAPEST',
    EXPENSIVE = 'EXPENSIVE',
    DISCOUNTS = 'DISCOUNTS',
    BESTSELLERS = 'BESTSELLERS',
    OFFERS = 'OFFERS',
}

export enum LengthType {
    SHORT = 'SHORT',
    REGULAR = 'REGULAR',
    LONG = 'LONG',
}

export enum ChAtBotEnum {
    USER = 'user',
    ASISTANT = 'asistant',
}
