import { Controller, Get, Headers, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('/me')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update logged in user',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async update(@UploadedFile() file: Express.Multer.File) {
        return await this.uploadService.create(file);
    }

    @Get(':id')
    async getMedia(@Res() res: Response, @Param('id') id: string, @Headers() headers?: Record<string, any>) {
        return await this.uploadService.get(id, res, headers.range);
    }

    // @HttpCode(HttpStatus.NO_CONTENT)
    // @Delete(':id')
    // async delete(@Param('id') fileId: string) {
    //     return await this.uploadService.deleteMedia(fileId);
    // }
}
