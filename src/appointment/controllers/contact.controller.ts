import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactDocument } from '../models/contact.entity';
import { ContactService } from '../services/contact.service';
import { CreateContactDto } from '../dto/contact/create.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post()
    async createContact(@Body() contactData: CreateContactDto): Promise<ContactDocument> {
        return this.contactService.createContact(contactData);
    }

    @Get()
    async getAllContacts(): Promise<ContactDocument[]> {
        return this.contactService.getAllContacts();
    }
}
