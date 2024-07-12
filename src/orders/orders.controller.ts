// src/order/order.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Order } from './models/order.schema';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    //orders
    

    // @Post()
    // async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    //     return this.orderService.createOrder(createOrderDto);
    // }

    @Get()
    async findAll(): Promise<Order[]> {
        return this.orderService.findAll();
    }

    // @Get(':id')
    // async findById(@Param('id') id: string): Promise<Order> {
    //     return this.orderService.findById(id);
    // }

    // @Patch(':id/status')
    // async updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    //     return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
    // }
}
