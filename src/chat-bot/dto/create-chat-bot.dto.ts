import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { ChAtBotEnum } from 'src/common';

class ChatContent {
    @ApiProperty({ type: String })
    @IsString()
    contant: string;

    @ApiProperty({ type: 'enum', enum: ChAtBotEnum })
    @IsEnum(ChAtBotEnum)
    role: ChAtBotEnum;
}

export class CreateChatBotDto {
    @ApiProperty({ type: ChatContent, isArray: true })
    @IsArray()
    messages: ChatContent[];
}
