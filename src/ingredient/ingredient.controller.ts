import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorInterceptor } from '../middleware/errorInterceptor.middleware';
import IngredientService from './ingredient.service';
import Ingredient, { PopulatedIngredient } from './ingredient.model';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import {
  AllIngredientsExample,
  SingleIngredientExample,
  TotalIngredientExample,
} from './examples';
import { createSchema } from '../utils/createSchema';
import PopulateQuery from '../middleware/populateQuery.middleware';
import ResultTransformer from '../middleware/resultTransformer.transformer';

@Controller('ingredient')
@UseInterceptors(ErrorInterceptor)
@UseInterceptors(ResultTransformer)
@UseInterceptors(CacheInterceptor)
@ApiTags('Ingredients')
export default class IngredientController {
  constructor(private readonly ingredients: IngredientService) {}

  @Get()
  @UseInterceptors(PopulateQuery)
  @ApiOkResponse({
    description: 'List of all ingredients',
    schema: createSchema(AllIngredientsExample),
  })
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiQuery({
    name: 'name',
    description: 'Get ingredients by name (across all storages)',
    required: false,
  })
  @ApiQuery({
    name: 'fill',
    enum: ['true', 'false'],
    description: 'Populates the storage field if true is passed',
  })
  async getAllIngredients(
    @Query('fill') fill?: boolean,
    @Query('name') name?: string,
  ) {
    let ingredients: Ingredient[] | PopulatedIngredient[];
    if (!name) {
      ingredients = await this.ingredients.getAllIngredients(fill);
    } else {
      ingredients = await this.ingredients.getIngredientsByName(name, fill);
    }
    return ingredients;
  }

  @Get('/:id')
  @UseInterceptors(PopulateQuery)
  @ApiOkResponse({
    description: 'Single ingredient data',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient data by id' })
  @ApiQuery({
    name: 'fill',
    enum: ['true', 'false'],
    description: 'Populates the storage field if true is passed',
  })
  getIngredientById(@Param('id') id: string, @Query('fill') fill: boolean) {
    return this.ingredients.getIngredientById(id, fill);
  }

  @Get('/:name/total')
  @ApiOkResponse({
    description: 'Ingredient data across all storages',
    schema: createSchema(TotalIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient data by name across all storages' })
  getTotalIngredientData(@Param('name') name: string) {
    return this.ingredients.getTotalIngredientData(name);
  }

  @Put('/:id')
  @ApiBody({ type: UpdateIngredientDTO })
  @ApiOkResponse({
    description: 'Updated ingredient data',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update ingredient by id' })
  updateIngredientById(
    @Param('id') id: string,
    @Body() body: UpdateIngredientDTO,
  ) {
    return this.ingredients.updateIngredientById(id, body);
  }

  @Put('/:name/all')
  @ApiBody({ type: UpdateIngredientByNameDTO })
  @ApiOkResponse({
    description: 'Updated ingredients data',
    schema: createSchema(AllIngredientsExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update ingredients by name' })
  updateIngredientByName(
    @Param('name') name: string,
    @Body() body: UpdateIngredientByNameDTO,
  ) {
    return this.ingredients.updateIngredientByName(name, body);
  }
}
