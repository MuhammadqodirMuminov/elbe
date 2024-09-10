import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create.dto';

export class UpdateContractDto extends PartialType(CreateContactDto) {}
