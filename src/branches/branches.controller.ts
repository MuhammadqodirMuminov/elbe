import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchDocument } from './models/branch.schema';

@ApiTags('branches')
@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) {}

    @Post()
    @ApiCreatedResponse({ type: BranchDocument })
    async create(@Body() createBranchDto: CreateBranchDto) {
        return this.branchesService.create(createBranchDto);
    }

    @Get()
    @ApiOkResponse({ type: [BranchDocument] })
    async findAll() {
        return this.branchesService.findAll();
    }

    @Get(':id')
    @ApiCreatedResponse({ type: BranchDocument })
    async findOne(@Param('id') id: string) {
        return this.branchesService.findOne(id);
    }

    @Patch(':id')
    @ApiCreatedResponse({ type: BranchDocument })
    async update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
        return this.branchesService.update(id, updateBranchDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.branchesService.remove(id);
    }
}
