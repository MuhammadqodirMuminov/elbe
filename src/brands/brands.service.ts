import { Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { BrandRepository } from './brands.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
    constructor(
        private readonly brandRepository: BrandRepository,
        private readonly uploadService: UploadService,
    ) {}

    async create(createBrandDto: CreateBrandDto) {
        const image = await this.uploadService.findOne(createBrandDto.logo);
        const brand = await this.brandRepository.create({ ...createBrandDto, logo: image._id });
        return brand;
    }

    async findAll() {
        return await this.brandRepository.find({}, 'logo');
    }

    async findOne(id: string) {
        return await this.brandRepository.findOne({ _id: id }, 'logo');
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        const updateDate: Record<string, any> = { ...updateBrandDto };
        if (updateBrandDto.logo) {
            const image = await this.uploadService.findOne(updateBrandDto.logo);
            updateDate.logo = image._id;
        }
        return await this.brandRepository.fundOneAndUpdate({ _id: id }, updateDate);
    }

    async remove(id: string) {
        const brand = await this.brandRepository.findOne({ _id: id });
        if (brand.logo) await this.uploadService.deleteMedia(brand._id.toString());
        await this.brandRepository.findOneAndDelete({ _id: id });
    }
}
