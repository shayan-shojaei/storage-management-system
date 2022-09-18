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
import { ADD_BATCH_EXAMPLE, ADD_EXAMPLE } from './examples';
import UseDTO from './dto/use.dto';
import ResultTransformer from '../middleware/resultTransformer.transformer';
import Ingredient from '../ingredient/ingredient.model';

@Controller('storage')
@UseInterceptors(ErrorInterceptor)
@ApiTags('Actions')
export class ActionsController {
  constructor(private readonly actions: ActionsService) {}

  @Post('/:storageId/add')
  @ApiBody({ type: AddDTO })
  @ApiOkResponse({
    description: 'Added ingredient with updated values.',
    schema: createSchema(ADD_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Add single ingredient to storage' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ResultTransformer(Ingredient))
  add(@Param('storageId') storageId: string, @Body() body: AddDTO) {
    return this.actions.addIngredient(body, storageId);
  }

  @Post('/:storageId/batch')
  @ApiBody({ type: BatchDTO })
  @ApiOkResponse({
    description: 'Array of added ingredients with updated values.',
    schema: createSchema(ADD_BATCH_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Add batch of ingredients to storage' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ResultTransformer(Ingredient))
  async addBatch(
    @Param('storageId') storageId: string,
    @Body() body: BatchDTO,
  ) {
    return this.actions.addIngredientsBatch(body, storageId);
  }

  @Post('/:storageId/use')
  @ApiBody({ type: UseDTO })
  @ApiOkResponse({
    description: 'Array of ingredients with updated amounts.',
    schema: createSchema(ADD_BATCH_EXAMPLE),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Use batch of ingredients from storage' })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ResultTransformer(Ingredient))
  async useBatch(@Param('storageId') storageId: string, @Body() body: UseDTO) {
    return this.actions.useIngredientsBatch(body, storageId);
  }
}
