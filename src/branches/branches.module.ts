import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchDocument, branchSchema } from './models/branch.schema';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: BranchDocument.name, schema: branchSchema }])],
    controllers: [BranchesController],
    providers: [BranchesService],
    exports: [BranchesService],
})
export class BranchesModule {}
