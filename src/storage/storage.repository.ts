import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import IngredientRepository from '../ingredient/ingredient.repository';
import CreateStorageDTO from './dto/createStorage.dto';
import UpdateStorageDTO from './dto/updateStorage.dto';
import Storage, { PopulatedStorage } from './storage.model';

@Injectable()
export default class StorageRepository {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storages: Collection<Storage>,
    private readonly ingredients: IngredientRepository,
  ) {}

  async findAll(fill = false) {
    const storages = await this.storages.find().toArray();
    return fill ? this.populateArray(storages) : storages;
  }

  async create(storageDto: CreateStorageDTO) {
    const storage = new Storage(storageDto.name);
    const { insertedId } = await this.storages.insertOne(storage);
    return this.storages.findOne({ _id: insertedId });
  }

  async update(id: ObjectId, storage: UpdateStorageDTO) {
    // Update
    await this.storages.updateOne(
      { _id: id },
      {
        $set: { ...storage },
      },
    );

    return this.storages.findOne({ _id: id });
  }

  delete(id: ObjectId) {
    return this.storages.deleteOne({ _id: id });
  }

  /**
   * Populate storage
   * @param {Storage} storage the storage to populate with ingredients data
   * @returns {PopulatedStorage} storage with populated ingredients data
   */
  async populateStorage(storage: Storage): Promise<PopulatedStorage> {
    const ingredients = await Promise.all(
      storage.ingredients.map(async (ingredientId) => {
        // find ingredient by id and remove storage field
        const ingredient = await this.ingredients.findById(ingredientId);
        ingredient.storage = undefined;
        return ingredient;
      }),
    );

    const populatedStorage = new PopulatedStorage(storage, ingredients);
    return populatedStorage;
  }

  async populateArray(storages: Storage[]): Promise<Array<PopulatedStorage>> {
    const populated = await Promise.all(
      storages.map((storage) => this.populateStorage(storage)),
    );
    return populated;
  }

  /**
   * Checks whether storage with given id exists or not.
   * @param {ObjectId} objectId Storage ObjectId
   * @returns {Promise<Storage>} returns the storage if it exists
   */
  async exists(objectId: ObjectId, populate = false) {
    const storage = await this.storages.findOne({ _id: objectId });

    // Check if storage exists
    if (!storage)
      throw new NotFoundException(
        `Storage with id ${objectId.toString()} was not found.`,
      );

    return populate ? this.populateStorage(storage) : storage;
  }
}
