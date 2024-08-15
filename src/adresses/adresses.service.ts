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
        @InjectModel(UserDocument.name) private readonly usersModel: Model<UserDocument>,
        private readonly usersService: UsersService,
    ) {}

    async create(createAdressDto: CreateAdressDto, userDocument: UserDocument) {
        try {
            const data: Record<string, any> = { ...createAdressDto };

            const costumer = await this.usersService.findWithQuery({ _id: userDocument._id });
            if (!costumer) throw new NotFoundException('No such customer found for this Id');
            data.customerId = costumer._id;

            const address = await this.addressModel.create({ _id: new Types.ObjectId(), ...data });

            await this.usersModel.updateOne(
                { _id: costumer._id },
                {
                    $push: { adresses: address._id },
                },
            );

            return address;
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async findAll(customerId: string) {
        const filterQuery: Record<string, any> = {};

        if (customerId) {
            filterQuery.customerId = new Types.ObjectId(customerId);
        }

        return await this.addressModel.find(filterQuery, {}, { populate: { path: 'customerId', model: UserDocument.name } });
    }

    async findOne(id: string) {
        const adress = await this.addressModel.findOne({ _id: id }, {}, { populate: { path: 'customerId', strictPopulate: false, model: UserDocument.name } });
        if (!adress) throw new NotFoundException('Address not found');
        return adress;
    }

    async update(id: string, updateAdressDto: UpdateAdressDto, user: UserDocument) {
        try {
            const updateData: Record<string, any> = { ...updateAdressDto };

            return await this.addressModel.updateOne({ _id: id }, updateData);
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }

    async remove(id: string, user: UserDocument) {
        try {
            await this.findOne(id);
            await this.usersModel.updateOne({ _id: user._id }, { $pull: { adresses: new Types.ObjectId(id) } });
            await this.addressModel.deleteOne({ _id: id });
        } catch (error) {
            throw new HttpException(error?.message || 'Internal Server Error', error?.status || 500);
        }
    }
}
