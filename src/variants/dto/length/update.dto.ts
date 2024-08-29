import { PartialType } from '@nestjs/swagger';
import { CreateLengthDto } from './create.dto';

export class UpdateLengthDto extends PartialType(CreateLengthDto) {}
