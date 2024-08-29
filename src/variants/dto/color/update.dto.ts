import { PartialType } from '@nestjs/swagger';
import { CreateColorDto } from './create.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {}
