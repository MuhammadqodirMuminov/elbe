import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/auth/users/models/user.schema';
import { UsersService } from 'src/auth/users/users.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { AdressDocument } from './models/adress.schema';

@Injectable()
export class AdressesService {
    constructor(
        @InjectModel(AdressDocument.name) private readonly addressModel: Model<AdressDocument>,
        private readonly usersService: UsersService,
    ) {}

    async create(createAdressDto: CreateAdressDto) {
        try {
            const data: Record<string, any> = { ...createAdressDto };

            const costumer = await this.usersService.findWithQuery({ _id: createAdressDto.customerId });
            if (!costumer) throw new NotFoundException('No such customer found for this Id');
            data.customerId = costumer._id;

            const address = await this.addressModel.create({ _id: new Types.ObjectId(), ...data });
            return address;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async findAll() {
        return await this.addressModel.find({}, {}, { populate: { path: 'customerId', model: UserDocument.name } });
    }

    async findOne(id: string) {
        const adress = await this.addressModel.findOne({ _id: id }, {}, { populate: { path: 'customerId', strictPopulate: false, model: UserDocument.name } });
        if (!adress) throw new NotFoundException('Address not found');
        return adress;
    }

    async update(id: string, updateAdressDto: UpdateAdressDto) {
        try {
            const updateData: Record<string, any> = { ...updateAdressDto };
            if (updateAdressDto.customerId) {
                const customerId = await this.usersService.findWithQuery({ _id: new Types.ObjectId(updateAdressDto.customerId) });
                if (!customerId) throw new NotFoundException('Customer not found');

                updateData.customerId = customerId;
            }

            return await this.addressModel.updateOne({ _id: id }, updateData);
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async remove(id: string) {
        try {
            await this.findOne(id);

            await this.addressModel.deleteOne({ _id: id });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }
}
