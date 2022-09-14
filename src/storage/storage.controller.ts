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
import ResultTransformer from '../middleware/resultTransformer.middleware';

@Controller('storage')
@UseInterceptors(CacheInterceptor)
@UseInterceptors(ResultTransformer)
@UseInterceptors(ErrorInterceptor)
@ApiTags('Storage')
export default class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Get()
  @ApiOkResponse({
    description: 'Array of storages',
    schema: createSchema(AllStoragesExample),
  })
  @ApiOperation({ summary: 'Get all storages' })
  getAllStorages() {
    return this.storage.getAllStorages();
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Single storage data',
    schema: createSchema(SingleStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get storage data by id' })
  getStorageById(@Param('id') id: string) {
    return this.storage.getStorageById(id);
  }

  @Post()
  @ApiBody({ type: CreateStorageDTO })
  @ApiCreatedResponse({
    description: 'Storage creation',
    schema: createSchema(SingleStorageExample),
  })
  @ApiOperation({ summary: 'Create new storage' })
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
  async getIngredientInStorage(
    @Param('id') id: string,
    @Param('ingredient') ingredientName: string,
  ) {
    return this.storage.getIngredientByName(id, ingredientName);
  }
}
