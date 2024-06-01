import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/common';
import { USER_STATUS } from '../interface/auth.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './models/user.schema';
import { UsersModule } from './users.module';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UsersModule>,
    ) {}

    async createUser(data: CreateUserDto) {
        await this.validateCreateUserData(data);
        const userDocument = await this.usersRepository.create({
            ...data,
            password: await hashPassword(data.password),
        });
        return this.getUserFromDocument(userDocument);
    }

    private async validateCreateUserData(data: CreateUserDto) {
        let userDocument: UserDocument;
        try {
            userDocument = await this.usersRepository.findOne({
                email: data.email,
                status: USER_STATUS.ACTIVE,
            });
        } catch (err) {}

        if (userDocument) {
            throw new UnprocessableEntityException('Email already exists, please login');
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await comparePassword(user.password, password);
        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
        delete user.password;
        return user;
    }

    async getUser(args: Partial<UserDocument>) {
        const userDocument = await this.usersRepository.findOne(args);
        return this.getUserFromDocument(userDocument);
    }

    async findWithQuery(filterQuery: FilterQuery<UserDocument>) {
        return await this.userModel.findOne(filterQuery);
    }

    private getUserFromDocument(userDocument: UserDocument) {
        return {
            _id: userDocument._id.toHexString(),
            email: userDocument.email,
            password: userDocument?.password,
        };
    }

    async getAll() {
        return await this.usersRepository.find({});
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const userDocument = await this.usersRepository.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        const updatedUser = await this.usersRepository.fundOneAndUpdate(userDocument._id, updateUserDto);
        return updatedUser;
    }

    async delete(id: string) {
        const userDocument = await this.usersRepository.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        await this.usersRepository.findOneAndDelete(userDocument._id);

        return 'deleted';
    }
}
