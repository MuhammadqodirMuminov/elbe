import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@ApiTags('wishlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
    constructor(private readonly wishlistsService: WishlistsService) {}

    @Post('add-to-wishlist')
    async create(@Body() createWishlistDto: CreateWishlistDto, @CurrentUser() user: UserDocument) {
        return await this.wishlistsService.create(createWishlistDto, user);
    }

    @Get('get-wishlist')
    async getWishlist(@CurrentUser() user: UserDocument) {
        return await this.wishlistsService.getAll(user);
    }

    @Delete('remove-from-wishlist/:id')
    async remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return await this.wishlistsService.remove(id, user);
    }
}
