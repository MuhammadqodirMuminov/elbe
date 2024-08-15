import { Module } from '@nestjs/common';
import { UserDocument, UserSchema } from 'src/auth/users/models/user.schema';
import { UsersModule } from 'src/auth/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AdressesController } from './adresses.controller';
import { AdressesService } from './adresses.service';
import { AdressDocument, AdressSchema } from './models/adress.schema';

@Module({
    imports: [
        UsersModule,
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: AdressDocument.name, schema: AdressSchema },
            { name: UserDocument.name, schema: UserSchema },
        ]),
    ],
    controllers: [AdressesController],
    providers: [AdressesService],
    exports: [AdressesService],
})
export class AdressesModule {}
