import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import AddDTO from './add.dto';

export default class BatchDTO {
  @ApiProperty({ description: 'Array of ingredients' })
  @IsArray({ each: true })
  ingredients: AddDTO[];
}
