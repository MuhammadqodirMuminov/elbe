// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/auth/users/users.repository';
import { Order, OrderDocument } from './models/order.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private readonly usersRepository: UsersRepository,
    ) {}

    // async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    //     await this.usersRepository.findOne({ _id: createOrderDto.user });

    //     const createdOrder = new this.orderModel(createOrderDto);
    //     return createdOrder.save();
    // }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }

    // async findById(id: string): Promise<Order> {
    //     return this.orderModel.findById(id).populate('user', '-password').populate('products.productId').exec();
    // }

    // async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    //     const existingOrder = await this.orderModel.findById(id).exec();
    //     if (!existingOrder) {
    //         throw new NotFoundException(`Order #${id} not found`);
    //     }

    //     existingOrder.shippingStatus = updateOrderStatusDto.shippingStatus;
    //     existingOrder.paymentStatus = updateOrderStatusDto.paymentStatus;

    //     return existingOrder.save();
    // }
}
