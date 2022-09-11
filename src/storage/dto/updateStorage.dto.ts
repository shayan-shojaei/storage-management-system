import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateStorageDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
