import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BranchesService } from 'src/branches/branches.service';
import { BranchDocument } from 'src/branches/models/branch.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceDocument } from './models/service.schema';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(ServiceDocument.name) private readonly serviceModel: Model<ServiceDocument>,
        private readonly branchService: BranchesService,
    ) {}

    async create(createServiceDto: CreateServiceDto): Promise<ServiceDocument> {
        const branches = await Promise.all(
            createServiceDto.branches.map(async (b) => {
                return (await this.branchService.findOne(b))._id;
            }),
        );

        return await this.serviceModel.create({ ...createServiceDto, branches, _id: new Types.ObjectId() });
    }

    async findAll(): Promise<ServiceDocument[]> {
        return await this.serviceModel.find({}, {}, { populate: [{ path: 'branches', model: BranchDocument.name }] });
    }

    async findOne(id: string): Promise<ServiceDocument> {
        const service = await this.serviceModel.findOne({ _id: id }, {}, { populate: [{ path: 'branches', model: BranchDocument.name }] });
        if (!service) {
            throw new NotFoundException('Service not found!');
        }
        return service;
    }

    async findByBranch(branchId: string): Promise<ServiceDocument[]> {
        const service = await this.serviceModel.find({ branches: { $in: [new Types.ObjectId(branchId)] } }, {}, { populate: [{ path: 'branches', model: BranchDocument.name }] });

        if (!service) {
            throw new NotFoundException('Service not found!');
        }

        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceDocument> {
        await this.findOne(id);
        const updatedBody: Record<string, any> = { ...updateServiceDto };

        if (updateServiceDto.branches.length !== 0) {
            const branches = await Promise.all(
                updateServiceDto.branches.map(async (b) => {
                    return (await this.branchService.findOne(b))._id;
                }),
            );

            updatedBody.branches = branches;
        }

        await this.serviceModel.updateOne({ _id: id }, updatedBody);

        return await this.findOne(id);
    }

    async remove(_id: string): Promise<void> {
        await this.findOne(_id);
        await this.serviceModel.deleteOne({ _id });
    }
}
