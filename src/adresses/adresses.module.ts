import { Module } from '@nestjs/common';
import { UsersModule } from 'src/auth/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { AdressesController } from './adresses.controller';
import { AdressesService } from './adresses.service';
import { AdressDocument, AdressSchema } from './models/adress.schema';

@Module({
    imports: [UsersModule, DatabaseModule, DatabaseModule.forFeature([{ name: AdressDocument.name, schema: AdressSchema }])],
    controllers: [AdressesController],
    providers: [AdressesService],
})
export class AdressesModule {}
