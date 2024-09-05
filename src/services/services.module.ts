import { Module } from '@nestjs/common';
import { BranchesModule } from 'src/branches/branches.module';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceDocument, serviceSchema } from './models/service.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
    imports: [BranchesModule, DatabaseModule, DatabaseModule.forFeature([{ name: ServiceDocument.name, schema: serviceSchema }])],
    controllers: [ServicesController],
    providers: [ServicesService],
    exports: [ServicesService],
})
export class ServicesModule {}
