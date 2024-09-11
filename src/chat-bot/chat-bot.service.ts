import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EndPoints } from 'src/common';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';

@Injectable()
export class ChatBotService {
    constructor(private readonly configService: ConfigService) {}

    async create(createChatBotDto: CreateChatBotDto) {
        const token = await this.configService.get('TOKEN');
        const chatId = await this.configService.get('CHATID');
        try {
            const response = await axios.post(
                EndPoints.chat,
                {
                    ...createChatBotDto,
                    chatbotId: chatId,
                    stream: false,
                    temperature: 0,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new BadGatewayException(error.message);
        }
    }

    async findAll() {
        return `This action returns all chatBot`;
    }
}
