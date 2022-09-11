import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import CreateStorageDTO from './dto/createStorage.dto';
import UpdateStorageDTO from './dto/updateStorage.dto';
import Storage from './storage.model';

@Injectable()
export default class StorageService {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storages: Collection<Storage>,
  ) {}

  async getAllStorages() {
    return this.storages.find().toArray();
  }

  async getStorageById(id: string) {
    const objectId = new ObjectId(id);

    const storage = this.storageExists(objectId);
    return storage;
  }

  async createStorage(storageDto: CreateStorageDTO) {
    const storage = new Storage(storageDto.name);
    const { insertedId } = await this.storages.insertOne(storage);
    return this.storages.findOne({ _id: insertedId });
  }

  async updateStorage(id: string, storageDto: UpdateStorageDTO) {
    const objectId = new ObjectId(id);
    await this.storageExists(objectId);

    // Update
    await this.storages.updateOne(
      { _id: objectId },
      {
        $set: { ...storageDto },
      },
    );

    return this.storages.findOne({ _id: objectId });
  }

  async deleteStorage(id: string) {
    const objectId = new ObjectId(id);
    await this.storageExists(objectId);
    return this.storages.deleteOne({ _id: objectId });
  }

  /**
   * Checks whether storage with given id exists or not.
   * @param {ObjectId} objectId Storage ObjectId
   * @returns {Promise<Storage>} returns the storage if it exists
   */
  private async storageExists(objectId: ObjectId) {
    const storage = await this.storages.findOne({ _id: objectId });

    // Check if storage exists
    if (!storage)
      throw new NotFoundException(
        `Storage with id ${objectId.toString()} was not found.`,
      );

    return storage;
  }
}
