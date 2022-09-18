import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createSchema } from '../utils/createSchema';
import { ErrorInterceptor } from '../middleware/errorInterceptor.middleware';
import { BatchJobDTO } from './dto/batchJob.dto';
import { UpdateBatchJobDTO } from './dto/updateBatchJob.dto';
import { ALL_EXAMPLE, DELETE_EXAMPLE, SINGLE_EXAMPLE } from './examples';
import { SchedulerService } from './scheduler.service';
import ResultTransformer from '../middleware/resultTransformer.transformer';
import Job from './models/job.model';
import ParseObjectId from '../pipes/parseObjectId.pipe';
import { ObjectId } from 'mongodb';

@Controller('scheduler')
@UseInterceptors(ErrorInterceptor)
@UseInterceptors(CacheInterceptor)
@ApiTags('Scheduler')
export class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) {}

  @Get()
  @ApiOkResponse({
    description: 'Array of scheduled jobs.',
    schema: createSchema(ALL_EXAMPLE),
  })
  @ApiOperation({ summary: 'Get all scheduled jobs' })
  @UseInterceptors(ResultTransformer(Job))
  getAll() {
    return this.scheduler.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Job data.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Get job data by id' })
  @UseInterceptors(ResultTransformer(Job))
  getById(@Param('id', new ParseObjectId()) id: ObjectId) {
    return this.scheduler.findById(id);
  }

  @Post()
  @ApiBody({
    type: BatchJobDTO,
  })
  @ApiCreatedResponse({
    description: 'Newly created job data.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Create and schedule a job' })
  @UseInterceptors(ResultTransformer(Job))
  create(@Body() body: BatchJobDTO) {
    return this.scheduler.create(body);
  }

  @Delete('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Deletion result.',
    schema: createSchema(DELETE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Delete a scheduled job' })
  @UseInterceptors(ResultTransformer(Object))
  delete(@Param('id', new ParseObjectId()) id: ObjectId) {
    return this.scheduler.delete(id);
  }

  @Put('/:id')
  @ApiBody({
    type: UpdateBatchJobDTO,
  })
  @ApiOkResponse({
    description: 'Update result.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Update a scheduled job' })
  @UseInterceptors(ResultTransformer(Job))
  update(
    @Param('id', new ParseObjectId()) id: ObjectId,
    @Body() body: UpdateBatchJobDTO,
  ) {
    return this.scheduler.update(id, body);
  }
}
