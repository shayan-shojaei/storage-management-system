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

@Controller('scheduler')
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
  async getAll() {
    const jobs = await this.scheduler.findAll();
    return { success: true, data: jobs };
  }

  @Get('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Job data.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Get job data by id' })
  async getById(@Param('id') id: string) {
    const job = await this.scheduler.findById(id);
    return { success: true, data: job };
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
  async create(@Body() body: BatchJobDTO) {
    const job = await this.scheduler.create(body);
    return { success: true, data: job };
  }

  @Delete('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Deletion result.',
    schema: createSchema(DELETE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Delete a scheduled job' })
  async delete(@Param('id') id: string) {
    await this.scheduler.delete(id);
    return { success: true };
  }

  @Put('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({
    type: UpdateBatchJobDTO,
  })
  @ApiOkResponse({
    description: 'Update result.',
    schema: createSchema(SINGLE_EXAMPLE),
  })
  @ApiOperation({ summary: 'Update a scheduled job' })
  async update(@Param('id') id: string, @Body() body: UpdateBatchJobDTO) {
    const job = await this.scheduler.update(id, body);
    return { success: true, data: job };
  }
}
