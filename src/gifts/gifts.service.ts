import { Injectable } from '@nestjs/common';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  create(createGiftDto: CreateGiftDto) {
    return 'This action adds a new gift';
  }

  findAll() {
    return `This action returns all gifts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gift`;
  }

  update(id: number, updateGiftDto: UpdateGiftDto) {
    return `This action updates a #${id} gift`;
  }

  remove(id: number) {
    return `This action removes a #${id} gift`;
  }
}
