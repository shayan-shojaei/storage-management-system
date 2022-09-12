import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import AddDTO from './add.dto';

export default class BatchDTO {
  @ApiProperty({ description: 'Array of ingredients', type: () => [AddDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddDTO)
  ingredients: AddDTO[];
}
