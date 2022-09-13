import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JobType, JOB_TYPES } from '../models/job.model';
import { BatchData } from './batchJob.dto';

export default class CreateJobDTO<JobData> {
  @ApiProperty({
    enum: JOB_TYPES,
  })
  @IsString()
  @IsIn(JOB_TYPES)
  @IsNotEmpty()
  type: JobType;

  @ApiProperty({
    description: 'Required data for job',
    type: () => BatchData,
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BatchData)
  data: JobData;

  @ApiProperty({ description: 'Valid cron expression' })
  @IsString()
  @IsNotEmpty()
  cron: string;
}
