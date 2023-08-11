import { ApiProperty } from '@nestjs/swagger';

export class UserData {
  @ApiProperty({ required: true, example: 'John Smith' })
  name: string;

  @ApiProperty({ required: true, example: 'john@smith.com' })
  email: string;
}
