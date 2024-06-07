// src/payment/payment.controller.ts
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentDocuemnt } from './models/payment.schema';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    async create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentDocuemnt> {
        return this.paymentService.create(createPaymentDto);
    }

    @Get()
    async findAll(): Promise<PaymentDocuemnt[]> {
        return this.paymentService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PaymentDocuemnt> {
        return this.paymentService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto): Promise<PaymentDocuemnt> {
        return this.paymentService.update(id, updatePaymentDto);
    }
}
