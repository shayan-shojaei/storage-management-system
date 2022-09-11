import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';

export default class CreateStorageDTO {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string;
}
