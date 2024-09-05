import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AppointmentService } from 'src/appointment/appointment.service';
import { BranchesService } from 'src/branches/branches.service';
import { ServicesService } from 'src/services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsQuery } from './dto/update-booking.dto';
import { BookingDocument } from './models/booking.schema';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(BookingDocument.name) private readonly bookingModel: Model<BookingDocument>,
        private readonly servicesService: ServicesService,
        private readonly branchesService: BranchesService,
        private readonly appintmentService: AppointmentService,
    ) {}

    async create(createBookingDto: CreateBookingDto) {
        const service = await this.servicesService.findOne(createBookingDto.serviceId);
        const branch = await this.branchesService.findOne(createBookingDto.branchId);
        const appointment = await this.appintmentService.findOne(createBookingDto.appointmentId);

        return await this.bookingModel.create({ ...createBookingDto, service_id: service._id, branch_id: branch._id, appointment_id: appointment._id });
    }

    async findAll(query: BookingsQuery) {
        const { startDate, endDate } = query;

        const filter: FilterQuery<BookingDocument> = {};
        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        return await this.bookingModel.find(filter, {}, { populate: ['service_id', 'branch_id', 'appointment_id'] });
    }

    async findOne(id: number) {
        const bookings = await this.bookingModel.findOne({ _id: id }, {}, { populate: ['service_id', 'branch_id', 'appointment_id'] });
        if (!bookings) {
            throw new NotFoundException('Bookings not found!');
        }
    }
}
