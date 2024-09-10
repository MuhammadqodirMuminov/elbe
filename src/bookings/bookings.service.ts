import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { AppointmentQueryDto } from 'src/appointment/dto/update-appointment.dto';
import { AppointmentService } from 'src/appointment/services/appointment.service';
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
        @Inject(forwardRef(() => AppointmentService)) private readonly appintmentService: AppointmentService,
    ) {}

    async create(createBookingDto: CreateBookingDto) {
        const service = await this.servicesService.findOne(createBookingDto.serviceId);
        const branch = await this.branchesService.findOne(createBookingDto.branchId);
        const appointment = await this.appintmentService.findOne(createBookingDto.appointmentId);

        return await this.bookingModel.create({
            ...createBookingDto,
            service_id: service._id,
            branch_id: branch._id,
            appointment_id: appointment._id,
            _id: new Types.ObjectId(),
        });
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

        return await this.bookingModel.find(
            filter,
            {},
            {
                populate: ['service_id', 'branch_id', 'appointment_id'],
            },
        );
    }

    async findByService(serviceId: string, query: AppointmentQueryDto) {
        const { date } = query;

        let filterDate: any = {};

        if (date) {
            const selectedDate = new Date(date);

            const startOfDay = new Date(selectedDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            filterDate = {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            };
        }

        const filter = {
            service_id: new Types.ObjectId(serviceId),
            ...filterDate,
        };

        const bookings = await this.bookingModel.find(filter);

        return bookings;
    }

    async findOne(id: string) {
        const bookings = await this.bookingModel.findOne({ _id: id }, {}, { populate: ['service_id', 'service_id.branches', 'branch_id', 'appointment_id', 'appointment_id.service'] });
        if (!bookings) {
            throw new NotFoundException('Bookings not found!');
        }

        return bookings;
    }
}
