import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createSchema } from '../utils/createSchema';
import { ErrorInterceptor } from '../middleware/errorInterceptor.middleware';
import { ActionsService } from './actions.service';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';
import {
  ADD_BATCH_EXAMPLE,
  ADD_BATCH_SCHEDULE_EXAMPLE,
  ADD_EXAMPLE,
} from './examples';
import BatchScheduleDTO from './dto/schedule.dto';

@Controller('storage')
@ApiTags('Actions')
export class ActionsController {
  constructor(private readonly actions: ActionsService) {}

  @Post('/:storageId/add')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({ type: AddDTO })
  @ApiOkResponse({
    description: 'Added ingredient with updated values.',
    schema: createSchema(ADD_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Add single ingredient to storage' })
  @HttpCode(HttpStatus.OK)
  async add(@Param('storageId') storageId: string, @Body() body: AddDTO) {
    const ingredient = await this.actions.addIngredient(body, storageId);
    return { success: true, data: ingredient };
  }

  @Post('/:storageId/batch')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({ type: BatchDTO })
  @ApiOkResponse({
    description: 'Array of added ingredients with updated values.',
    schema: createSchema(ADD_BATCH_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Add batch of ingredients to storage' })
  @HttpCode(HttpStatus.OK)
  async addBatch(
    @Param('storageId') storageId: string,
    @Body() body: BatchDTO,
  ) {
    const batch = await this.actions.addIngredientsBatch(body, storageId);
    return { success: true, data: batch };
  }

  @Post('/:storageId/schedule')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({ type: BatchScheduleDTO })
  @ApiOkResponse({
    description: 'Scheduled job data.',
    schema: createSchema(ADD_BATCH_SCHEDULE_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({
    summary: 'Schedule the addition of a batch of ingredients to storage',
  })
  @HttpCode(HttpStatus.OK)
  async scheduleBatch(
    @Param('storageId') storageId: string,
    @Body() body: BatchScheduleDTO,
  ) {
    const batch = await this.actions.scheduleIngredientsBatch(body, storageId);
    return { success: true, data: batch };
  }
}
