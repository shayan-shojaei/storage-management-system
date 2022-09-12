import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BatchData } from 'src/scheduler/models/batchJob.model';
import { SchedulerService } from '../scheduler/scheduler.service';
import ActionsRepository from './actions.repository';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';
import BatchScheduleDTO from './dto/schedule.dto';

@Injectable()
export class ActionsService {
  constructor(
    private readonly repository: ActionsRepository,
    @Inject(forwardRef(() => SchedulerService))
    private readonly scheduler: SchedulerService,
  ) {}

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

  async scheduleIngredientsBatch(data: BatchScheduleDTO, storage: string) {
    const storageId = new ObjectId(storage);
    await this.checkStorage(storageId);

    const jobData: BatchData = {
      data: data.data,
      storageId: storage,
    };
    return this.scheduler.createJob('BATCH_ADD', data.cron, jobData);
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
