import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { unitConverter } from 'src/utils/unitConverter';
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

  async useIngredientsBatch(batch: BatchDTO, storageId: string) {
    const id = new ObjectId(storageId);
    const storage = await this.checkStorage(id);

    // calculate new amounts after reduction
    const updatedIngredients =
      await this.repository.calculateUpdatedIngredients(batch, storage);

    // update ingredients with new values
    return this.repository.updateIngredientsAmounts(updatedIngredients);
  }

  async checkStorage(id: ObjectId) {
    const storage = await this.repository.storageExists(id);
    if (!storage) {
      throw new NotFoundException(
        `Storage with id ${id.toString()} was not found.`,
      );
    }
    return storage;
  }
}
