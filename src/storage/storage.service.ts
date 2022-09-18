import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import IngredientRepository from '../ingredient/ingredient.repository';
import CreateStorageDTO from './dto/createStorage.dto';
import UpdateStorageDTO from './dto/updateStorage.dto';
import StorageRepository from './storage.repository';

@Injectable()
export default class StorageService {
  constructor(
    private readonly storages: StorageRepository,
    private readonly ingredients: IngredientRepository,
  ) {}

  async getAllStorages(fill = false) {
    return this.storages.findAll(fill);
  }

  getStorageById(id: ObjectId, fill = false) {
    return this.storages.exists(id, fill);
  }

  async getIngredientByName(id: ObjectId, ingredientName: string) {
    await this.storages.exists(id);

    const ingredient = await this.ingredients.findInStorage(id, ingredientName);

    if (ingredient) return ingredient;

    throw new NotFoundException(
      `Ingredient with name ${ingredientName} was not found in storage ${id.toString()}`,
    );
  }

  async createStorage(storageDto: CreateStorageDTO) {
    return this.storages.create(storageDto);
  }

  async updateStorage(id: ObjectId, storageDto: UpdateStorageDTO) {
    await this.storages.exists(id);
    return this.storages.update(id, storageDto);
  }

  async deleteStorage(id: ObjectId) {
    await this.storages.exists(id);
    const { deletedCount } = await this.storages.delete(id);
    if (deletedCount === 1) {
      // successful deletion
      return {};
    }

    throw new BadGatewayException(
      `Failed to delete storage with id ${id.toString()}`,
    );
  }
}
