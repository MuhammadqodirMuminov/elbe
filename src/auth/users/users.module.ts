import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'src/upload/upload.module';
import { UserDocument, UserSchema } from './models/user.schema';
import { UsersController } from './user.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    imports: [UploadModule, MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }])],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
