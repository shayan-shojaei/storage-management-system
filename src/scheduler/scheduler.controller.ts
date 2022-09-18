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

@Controller('scheduler')
@UseInterceptors(ResultTransformer)
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
  getAll() {
    return this.scheduler.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Job data.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Get job data by id' })
  getById(@Param('id') id: string) {
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
  delete(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() body: UpdateBatchJobDTO) {
    return this.scheduler.update(id, body);
  }
}
