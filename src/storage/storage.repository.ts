import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import CreateStorageDTO from './dto/createStorage.dto';
import UpdateStorageDTO from './dto/updateStorage.dto';
import Storage from './storage.model';

@Injectable()
export default class StorageRepository {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storages: Collection<Storage>,
  ) {}

  findAll() {
    return this.storages.find().toArray();
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
   * Checks whether storage with given id exists or not.
   * @param {ObjectId} objectId Storage ObjectId
   * @returns {Promise<Storage>} returns the storage if it exists
   */
  async exists(objectId: ObjectId) {
    const storage = await this.storages.findOne({ _id: objectId });

    // Check if storage exists
    if (!storage)
      throw new NotFoundException(
        `Storage with id ${objectId.toString()} was not found.`,
      );

    return storage;
  }
}
