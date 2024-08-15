import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { CurrentUser } from '../current-user.decorator';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './models/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll() {
        return await this.usersService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.usersService.getUser({
            _id: new mongoose.Types.ObjectId(id),
        });
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: UserDocument) {
        return await this.usersService.update(user._id.toString(), updateUserDto);
    }

    // @Delete(':id')
    // async delete(@Param('id') id: string) {
    //     return await this.usersService.delete(id);
    // }
}
