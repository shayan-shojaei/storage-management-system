import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import ActionsRepository from './actions.repository';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';

@Injectable()
export class ActionsService {
  constructor(private readonly repository: ActionsRepository) {}

  async addIngredient(add: AddDTO, storage: string) {
    const storageId = new ObjectId(storage);
    await this.checkStorage(storageId);
    return this.repository.addIngredient(add, storageId);
  }

  async addIngredientsBatch(batch: BatchDTO, storage: string) {
    const storageId = new ObjectId(storage);
    await this.checkStorage(storageId);
    return this.repository.addBatchIngredient(batch, storageId);
  }

  async checkStorage(storage: ObjectId) {
    const exists = await this.repository.storageExists(storage);
    if (!exists) {
      throw new NotFoundException(
        `Storage with id ${storage.toString()}... was not found.`,
      );
    }
  }
}
