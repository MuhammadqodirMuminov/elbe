import { PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create.dto';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {}
