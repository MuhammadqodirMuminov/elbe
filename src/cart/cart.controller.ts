// src/cart/cart.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/create-cart.dto';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async create(@CurrentUser() user: UserDocument) {
        return this.cartService.getOrcreate(user);
    }

    @Post('upsert-item')
    async updateActiveCart(
        @Body() itemUpdateDto: UpdateCartDto,
        @CurrentUser()
        user: UserDocument,
    ) {
        return this.cartService.updateActiveCart(user, itemUpdateDto);
    }

    @Post('empty-cart')
    async emptyActiveCart(
        @CurrentUser()
        user: UserDocument,
    ) {
        return this.cartService.emptyActiveCart(user);
    }

    @Delete('cart-items/:id')
    async removeCart(
        @Param('id') cartItemId: string,
        @CurrentUser()
        user: UserDocument,
    ) {
        return this.cartService.removeItem(cartItemId, user);
    }
}
