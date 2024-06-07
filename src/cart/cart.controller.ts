// src/cart/cart.controller.ts
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto/create-cart.dto';
import { CartDocument } from './models/cart.schema';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    async create(@Body() createCartDto: CreateCartDto): Promise<CartDocument> {
        return this.cartService.create(createCartDto);
    }

    @Get(':userId')
    async findByUser(@Param('userId') userId: string): Promise<CartDocument> {
        return this.cartService.findByUser(userId);
    }

    @Get()
    async findAll(): Promise<CartDocument[]> {
        return this.cartService.findAll();
    }

    @Post(':userId/add-item')
    async addItem(@Param('userId') userId: string, @Body() updateCartDto: UpdateCartDto): Promise<CartDocument> {
        return this.cartService.addItem(userId, updateCartDto);
    }

    @Delete(':userId/remove-item/:productId')
    async removeItem(@Param('userId') userId: string, @Param('productId') productId: string): Promise<CartDocument> {
        return this.cartService.removeItem(userId, productId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('clear/:userId')
    async clearcart(@Param('userId') userId: string): Promise<void> {
        return await this.cartService.clearCart(userId);
    }
}
