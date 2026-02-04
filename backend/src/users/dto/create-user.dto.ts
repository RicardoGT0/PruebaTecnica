import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  role: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

export interface UserCreationAttrs {
  role: string;
  name: string;
  email: string;
}
