import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import AddDTO from '../../actions/dto/add.dto';
import CreateJobDTO from './createJob.dto';

export class UpdateBatchData {
  @ApiProperty()
  @IsString()
  storageId: string;

  @ApiProperty({ type: () => [AddDTO] })
  @IsArray()
  @ValidateNested()
  @Type(() => AddDTO)
  ingredients: AddDTO[];
}

export class UpdateBatchJobDTO extends CreateJobDTO<UpdateBatchData> {}
