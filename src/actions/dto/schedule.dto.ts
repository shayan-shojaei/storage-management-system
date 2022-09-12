import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import AddDTO from './add.dto';

export default class BatchScheduleDTO {
  @ApiProperty({ description: 'Array of ingredients', type: () => [AddDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddDTO)
  data: AddDTO[];

  @ApiProperty({ description: 'Valid cron expression' })
  @IsString()
  @IsNotEmpty()
  cron: string;
}
