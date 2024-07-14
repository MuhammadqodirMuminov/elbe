// src/payment/payment.controller.ts
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { QueryProductDto } from 'src/products/dto/query.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    async create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: UserDocument) {
        return this.paymentService.create(createPaymentDto, user);
    }

    @Get()
    async getAll(@Query() query: QueryProductDto, @CurrentUser() user: UserDocument) {
        return this.paymentService.getAll(query, user);
    }
}
