import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchDocument } from './models/branch.schema';

@Injectable()
export class BranchesService {
    constructor(@InjectModel(BranchDocument.name) private readonly branchModel: Model<BranchDocument>) {}

    async create(createBranchDto: CreateBranchDto): Promise<BranchDocument> {
        return await this.branchModel.create({ ...createBranchDto, _id: new Types.ObjectId() });
    }

    async findAll(): Promise<BranchDocument[]> {
        return await this.branchModel.find();
    }

    async findOne(id: string): Promise<BranchDocument> {
        const branch = await this.branchModel.findOne({ _id: id });

        if (!branch) {
            throw new NotFoundException('branch not found!');
        }

        return branch;
    }

    async update(id: string, updateBranchDto: UpdateBranchDto): Promise<BranchDocument> {
        await this.findOne(id);

        await this.branchModel.updateOne({ _id: id }, updateBranchDto);
        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);

        await this.branchModel.deleteOne({ _id: id });
    }
}
