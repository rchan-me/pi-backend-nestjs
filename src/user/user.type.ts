import { ApiProperty } from '@nestjs/swagger';

export class UserData {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;
}
