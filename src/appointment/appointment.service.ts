import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BranchDocument } from 'src/branches/models/branch.schema';
import { ServiceDocument } from 'src/services/models/service.schema';
import { ServicesService } from 'src/services/services.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './models/appointment.schema';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name) private readonly appintmentModel: Model<Appointment>,
        private readonly servicesService: ServicesService,
    ) {}

    async create(createAppointmentDto: CreateAppointmentDto) {
        const services = await Promise.all(
            createAppointmentDto.service.map(async (s) => {
                return (await this.servicesService.findOne(s))._id;
            }),
        );

        return await this.appintmentModel.create({ ...createAppointmentDto, service: services, _id: new Types.ObjectId() });
    }

    async findAll() {
        return await this.appintmentModel.find(
            {},
            {},
            {
                populate: [
                    {
                        path: 'service',
                        model: ServiceDocument.name,
                        populate: [
                            {
                                path: 'branches',
                                model: BranchDocument.name,
                            },
                        ],
                    },
                ],
            },
        );
    }

    async findByServiceId(serviceId: string) {
        const appointment = await this.appintmentModel.find(
            { service: { $in: [new Types.ObjectId(serviceId)] } },
            {},
            {
                populate: [
                    {
                        path: 'service',
                        model: ServiceDocument.name,
                        populate: [
                            {
                                path: 'branches',
                                model: BranchDocument.name,
                            },
                        ],
                    },
                ],
            },
        );

        if (!appointment) {
            throw new NotFoundException('No appointment found!');
        }
        return appointment;
    }

    async findOne(id: string) {
        const appointment = await this.appintmentModel.findOne(
            { _id: id },
            {},
            {
                populate: [
                    {
                        path: 'service',
                        model: ServiceDocument.name,
                        populate: [
                            {
                                path: 'branches',
                                model: BranchDocument.name,
                            },
                        ],
                    },
                ],
            },
        );

        if (!appointment) {
            throw new NotFoundException('No appointment found!');
        }

        return appointment;
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
        await this.findOne(id);
        const updatedBody: Record<string, any> = { ...updateAppointmentDto };

        if (updateAppointmentDto.service) {
            const services = await Promise.all(
                updateAppointmentDto.service.map(async (s) => {
                    return (await this.servicesService.findOne(s))._id;
                }),
            );
            updatedBody.service = services;
        }

        await this.appintmentModel.updateOne({ _id: id }, updatedBody);

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);

        await this.appintmentModel.deleteOne({ _id: id });
    }
}
