import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import AddDTO from '../../actions/dto/add.dto';
import CreateJobDTO from './createJob.dto';

export class BatchData {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storageId: string;

  @ApiProperty({ type: () => [AddDTO] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => AddDTO)
  ingredients: AddDTO[];
}

export class BatchJobDTO extends CreateJobDTO<BatchData> {}
