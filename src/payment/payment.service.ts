import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PayOptions } from 'src/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentDocuemnt } from './models/payment.schema';

@Injectable()
export class PaymentService {
    constructor(@InjectModel(PaymentDocuemnt.name) private paymentModel: Model<PaymentDocuemnt>) {}

    async create(createPaymentDto: CreatePaymentDto): Promise<PaymentDocuemnt> {
        const createdPayment = new this.paymentModel({ ...createPaymentDto, status: PayOptions.SUCCEEDED, transactionId: 2 });
        return createdPayment.save();
    }

    async findAll(): Promise<PaymentDocuemnt[]> {
        return this.paymentModel.find().populate('order').exec();
    }

    async findOne(id: string): Promise<PaymentDocuemnt> {
        return this.paymentModel.findById(id).populate('order').exec();
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentDocuemnt> {
        return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, { new: true }).exec();
    }
}
