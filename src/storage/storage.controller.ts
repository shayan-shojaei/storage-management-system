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
import CreateStorageDTO from './dto/createStorage.dto';
import StorageService from './storage.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import UpdateStorageDTO from './dto/updateStorage.dto';
import { ErrorInterceptor } from '../middleware/errorInterceptor.middleware';
import {
  AllStoragesExample,
  DeleteStorageExample,
  SingleStorageExample,
} from './examples';
import { createSchema } from '../utils/createSchema';
import { SingleIngredientExample } from '../ingredient/examples';
import ResultTransformer from '../middleware/resultTransformer.transformer';
import Storage, { PopulatedStorage } from './storage.model';
import Ingredient from '../ingredient/ingredient.model';

@Controller('storage')
@UseInterceptors(ErrorInterceptor)
@UseInterceptors(CacheInterceptor)
@ApiTags('Storage')
export default class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Get()
  @ApiOkResponse({
    description: 'Array of storages',
    schema: createSchema(AllStoragesExample),
  })
  @ApiOperation({ summary: 'Get all storages' })
  @UseInterceptors(ResultTransformer(Storage))
  getAllStorages() {
    return this.storage.getAllStorages(false);
  }

  @Get('/populated')
  @ApiOkResponse({
    description: 'Array of storages, populated with ingredients',
    schema: createSchema(AllStoragesExample),
  })
  @ApiOperation({ summary: 'Get all storages, populated with ingredients' })
  @UseInterceptors(ResultTransformer(PopulatedStorage))
  getAllPopulatedStorages() {
    return this.storage.getAllStorages(true);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Single storage data',
    schema: createSchema(SingleStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get storage data by id' })
  @UseInterceptors(ResultTransformer(Storage))
  getStorageById(@Param('id') id: string) {
    return this.storage.getStorageById(id, false);
  }

  @Get('/:id/populated')
  @ApiOkResponse({
    description: 'Single storage data, populated with ingredients',
    schema: createSchema(SingleStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({
    summary: 'Get storage data by id, populated with ingredients',
  })
  @UseInterceptors(ResultTransformer(PopulatedStorage))
  getPopulatedStorageById(@Param('id') id: string) {
    return this.storage.getStorageById(id, true);
  }

  @Post()
  @ApiBody({ type: CreateStorageDTO })
  @ApiCreatedResponse({
    description: 'Storage creation',
    schema: createSchema(SingleStorageExample),
  })
  @ApiOperation({ summary: 'Create new storage' })
  @UseInterceptors(ResultTransformer(Storage))
  createStorage(@Body() storage: CreateStorageDTO) {
    return this.storage.createStorage(storage);
  }

  @Put('/:id')
  @ApiBody({ type: UpdateStorageDTO })
  @ApiCreatedResponse({
    description: 'Storage update',
    schema: createSchema(SingleStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Update storage by id' })
  @UseInterceptors(ResultTransformer(Storage))
  async updateStorage(
    @Param('id') id: string,
    @Body() storage: UpdateStorageDTO,
  ) {
    return this.storage.updateStorage(id, storage);
  }

  @Delete('/:id')
  @ApiCreatedResponse({
    description: 'Storage deletion',
    schema: createSchema(DeleteStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Delete storage by id' })
  @UseInterceptors(ResultTransformer(Object))
  deleteStorage(@Param('id') id: string) {
    return this.storage.deleteStorage(id);
  }

  @Get('/:id/:ingredient')
  @ApiOkResponse({
    description: 'Ingredient data in storage',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient in storage by name' })
  @UseInterceptors(ResultTransformer(Ingredient))
  async getIngredientInStorage(
    @Param('id') id: string,
    @Param('ingredient') ingredientName: string,
  ) {
    return this.storage.getIngredientByName(id, ingredientName);
  }
}
