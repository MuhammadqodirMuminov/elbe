import { PartialType } from '@nestjs/swagger';
import { CreateSizeGuideDto } from './create.dto';

export class UpdateSizeGuideDto extends PartialType(CreateSizeGuideDto) {}
