import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatBotService } from './chat-bot.service';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';

@ApiTags('ChatBot')
@Controller('chat-bot')
export class ChatBotController {
    constructor(private readonly chatBotService: ChatBotService) {}

    @Post()
    @HttpCode(200)
    async create(@Body() createChatBotDto: CreateChatBotDto) {
        return this.chatBotService.create(createChatBotDto);
    }

    @Get('get-all')
    async findAll() {
        return this.chatBotService.findAll();
    }
}
