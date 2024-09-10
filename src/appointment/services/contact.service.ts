import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateContactDto } from '../dto/contact/create.dto';
import { ContactDocument } from '../models/contact.entity';

@Injectable()
export class ContactService {
    constructor(@InjectModel(ContactDocument.name) private readonly contactModel: Model<ContactDocument>) {}

    async createContact(contactData: CreateContactDto): Promise<ContactDocument> {
        const contact = new this.contactModel({ ...contactData, _id: new Types.ObjectId() });
        return contact.save();
    }

    async getAllContacts(): Promise<ContactDocument[]> {
        return this.contactModel.find().exec();
    }
}
