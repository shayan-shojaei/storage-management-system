import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllStorages() {
    return this.storages.findAll();
  }

  async getStorageById(id: string) {
    const objectId = new ObjectId(id);

    const storage = await this.storages.exists(objectId);
    return storage;
  }

  async getIngredientByName(id: string, ingredientName: string) {
    const objectId = new ObjectId(id);
    await this.storages.exists(objectId);

    const ingredient = await this.ingredients.findInStorage(
      objectId,
      ingredientName,
    );

    if (ingredient) return ingredient;

    throw new NotFoundException(
      `Ingredient with name ${ingredientName} was not found in storage ${id}`,
    );
  }

  async createStorage(storageDto: CreateStorageDTO) {
    return this.storages.create(storageDto);
  }

  async updateStorage(id: string, storageDto: UpdateStorageDTO) {
    const objectId = new ObjectId(id);
    await this.storages.exists(objectId);

    return this.storages.update(objectId, storageDto);
  }

  async deleteStorage(id: string) {
    const objectId = new ObjectId(id);
    await this.storages.exists(objectId);
    return this.storages.delete(objectId);
  }
}
