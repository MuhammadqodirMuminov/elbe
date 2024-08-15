import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { AdressesService } from './adresses.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';

@ApiTags('address')
@Controller('addresses')
export class AdressesController {
    constructor(private readonly adressesService: AdressesService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createAdressDto: CreateAdressDto, @CurrentUser() user: UserDocument) {
        return await this.adressesService.create(createAdressDto, user);
    }

    @ApiQuery({
        name: 'customerId',
        description: 'Customer ID to filter addresses',
        type: String,
        required: false,
    })
    @Get()
    async findAll(@Query('customerId') customerId: string) {
        return await this.adressesService.findAll(customerId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.adressesService.findOne(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAdressDto: UpdateAdressDto, @CurrentUser() user: UserDocument) {
        return await this.adressesService.update(id, updateAdressDto, user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return await this.adressesService.remove(id, user);
    }
}
