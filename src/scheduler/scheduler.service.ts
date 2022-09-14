import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ActionsService } from '../actions/actions.service';
import Job, { JobType } from './models/job.model';
import SchedulerRepository from './scheduler.repository';
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { BatchData, BatchJobDTO } from './dto/batchJob.dto';
import { UpdateBatchJobDTO } from './dto/updateBatchJob.dto';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    private readonly jobs: SchedulerRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ActionsService))
    private readonly actions: ActionsService,
  ) {}

  findAll() {
    return this.jobs.findAll();
  }

  async findById(id: string) {
    const jobId = new ObjectId(id);
    return this.jobs.exists(jobId);
  }

  async create(createDto: BatchJobDTO) {
    const job = await this.createJob(
      createDto.type,
      createDto.cron,
      createDto.data,
    );
    return job;
  }

  async delete(id: string) {
    return this.deleteJob(id);
  }

  async update(id: string, body: UpdateBatchJobDTO) {
    const jobId = new ObjectId(id);
    const newJob = await this.jobs.update(jobId, body);

    // restart job
    this.stopJob(id);
    this.setupJob(newJob);

    return newJob;
  }

  async onApplicationBootstrap() {
    // start all scheduled cron jobs from database
    const jobs = await this.jobs.findAll();
    if (jobs.length === 0) return;
    console.log(`Setting up scheduled jobs... ${jobs.length} jobs pending.`);
    for (const job of jobs) {
      this.setupJob(job);
    }
    console.log('All jobs were scheduled.');
  }

  async createJob(type: JobType, cron: string, data: BatchData) {
    // check cron string validity
    if (!isValidCron(cron, { seconds: true })) {
      throw new BadRequestException(
        `The expression ${cron} is not a valid cron expression.`,
      );
    }

    // insert job into database
    const createdJob = new Job(type, data, cron);
    const job = await this.jobs.insert(createdJob);

    // setup created job's scheduler
    this.setupJob(job);

    return job;
  }

  async deleteJob(id: string) {
    // delete from database
    const jobId = new ObjectId(id);
    await this.jobs.exists(jobId);
    const success = await this.jobs.delete(jobId);

    if (!success) {
      throw new BadGatewayException(`Failed to delete job with id ${id}`);
    }

    // stop job
    this.stopJob(id);

    // successful deletion
    return {};
  }

  private stopJob(id: string) {
    this.schedulerRegistry.getCronJob(id).stop();
    this.schedulerRegistry.deleteCronJob(id);
  }

  private setupJob(job: Job<BatchData>) {
    switch (job.type) {
      case 'BATCH_ADD':
        this.setupBatch(job);
        break;
    }
  }

  private setupBatch(job: Job<BatchData>) {
    const cronJob = new CronJob(job.cron, async () => {
      const jobId = job._id;
      // get new job data
      const {
        data: { ingredients, storageId },
      } = (await this.jobs.findById(jobId)) as Job<BatchData>;

      await this.actions.addIngredientsBatch({ ingredients }, storageId);
    });

    this.schedulerRegistry.addCronJob(job._id.toString(), cronJob);
    cronJob.start();
  }
}
