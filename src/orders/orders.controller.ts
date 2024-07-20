import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { QueryProductDto } from 'src/products/dto/query.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('user-orders')
    async getAll(@Query() query: QueryProductDto, @CurrentUser() user: UserDocument) {
        return await this.ordersService.getAll(query, user);
    }

    @Get()
    async findAll() {
        return await this.ordersService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.ordersService.getOrderById(id);
    }
}
