import {
  Body,
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

@Controller('ingredient')
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
    return { succes: true, count: ingredients.length, data: ingredients };
  }

  @Get('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Single ingredient data',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient data by id' })
  async getIngredientById(@Param('id') id: string) {
    const ingredient = await this.ingredients.getIngredientById(id);
    return { success: true, data: ingredient };
  }

  @Get('/:name/total')
  @ApiOkResponse({
    description: 'Ingredient data across all storages',
    schema: createSchema(TotalIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient data by name across all storages' })
  async getTotalIngredientData(@Param('name') name: string) {
    const ingredient = await this.ingredients.getTotalIngredientData(name);
    return { success: true, data: ingredient };
  }

  @Put('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({ type: UpdateIngredientDTO })
  @ApiOkResponse({
    description: 'Updated ingredient data',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update ingredient by id' })
  async updateIngredientById(
    @Param('id') id: string,
    @Body() body: UpdateIngredientDTO,
  ) {
    const ingredient = await this.ingredients.updateIngredientById(id, body);
    return { success: true, data: ingredient };
  }

  @Put('/:name/all')
  @UseInterceptors(ErrorInterceptor)
  @ApiBody({ type: UpdateIngredientByNameDTO })
  @ApiOkResponse({
    description: 'Updated ingredients data',
    schema: createSchema(AllIngredientsExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update ingredients by name' })
  async updateIngredientByName(
    @Param('name') name: string,
    @Body() body: UpdateIngredientByNameDTO,
  ) {
    const ingredients = await this.ingredients.updateIngredientByName(
      name,
      body,
    );
    return { success: true, count: ingredients.length, data: ingredients };
  }
}
