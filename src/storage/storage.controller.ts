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

@Controller('storage')
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
  async getAllStorages() {
    const storages = await this.storage.getAllStorages();
    return { succes: true, count: storages.length, data: storages };
  }

  @Get('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Single storage data',
    schema: createSchema(SingleStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get storage data by id' })
  async getStorageById(@Param('id') id: string) {
    const storage = await this.storage.getStorageById(id);
    return { success: true, data: storage };
  }

  @Post()
  @ApiBody({ type: CreateStorageDTO })
  @ApiCreatedResponse({
    description: 'Storage creation',
    schema: createSchema(SingleStorageExample),
  })
  @ApiOperation({ summary: 'Create new storage' })
  async createStorage(@Body() storage: CreateStorageDTO) {
    const newStorage = await this.storage.createStorage(storage);
    return { success: true, data: newStorage };
  }

  @Put('/:id')
  @ApiBody({ type: UpdateStorageDTO })
  @UseInterceptors(ErrorInterceptor)
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
    const newStorage = await this.storage.updateStorage(id, storage);
    return { success: true, data: newStorage };
  }

  @Delete('/:id')
  @UseInterceptors(ErrorInterceptor)
  @ApiCreatedResponse({
    description: 'Storage deletion',
    schema: createSchema(DeleteStorageExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Delete storage by id' })
  async deleteStorage(@Param('id') id: string) {
    await this.storage.deleteStorage(id);
    return { success: true };
  }

  @Get('/:id/:ingredient')
  @UseInterceptors(ErrorInterceptor)
  @ApiOkResponse({
    description: 'Ingredient data in storage',
    schema: createSchema(SingleIngredientExample),
  })
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Get ingredient in storage by name.' })
  async getIngredientInStorage(
    @Param('id') id: string,
    @Param('ingredient') ingredientName: string,
  ) {
    const ingredient = await this.storage.getIngredientByName(
      id,
      ingredientName,
    );
    return { success: true, data: ingredient };
  }
}
