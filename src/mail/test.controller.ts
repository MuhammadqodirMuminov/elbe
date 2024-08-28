import { Body, Controller, Post } from '@nestjs/common';
import { Test } from './dto/attempt.dto';
import { MailService } from './services/mail.service';

@Controller('test-email')
export class TestEmailController {
    constructor(private readonly mailSerivce: MailService) {}

    @Post('email')
    async getEmail(@Body() body: Test) {
        return await this.mailSerivce.testEmail(body.email);
    }
}
