import { ApiProperty } from '@nestjs/swagger';

export class AttempDto {
    email: string;
    code: number;
}

export class Test {
    @ApiProperty()
    email: string;
}
