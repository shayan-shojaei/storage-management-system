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
import Ingredient from './ingredient.model';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import {
  AllIngredientsExample,
  SingleIngredientExample,
  TotalIngredientExample,
} from './examples';
import { createSchema } from '../utils/createSchema';
import ResultTransformer from '../middleware/resultTransformer.middleware';

@Controller('ingredient')
@UseInterceptors(CacheInterceptor)
@UseInterceptors(ResultTransformer)
@UseInterceptors(ErrorInterceptor)
@ApiTags('Ingredients')
export default class IngredientController {
  constructor(private readonly ingredients: IngredientService) {}

  @Get()
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
  async getAllIngredients(@Query('name') name?: string) {
    let ingredients: Ingredient[];
    if (!name) {
      ingredients = await this.ingredients.getAllIngredients();
    } else {
      ingredients = await this.ingredients.getIngredientsByName(name);
    }
    return ingredients;
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Single ingredient data',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient data by id' })
  getIngredientById(@Param('id') id: string) {
    return this.ingredients.getIngredientById(id);
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
