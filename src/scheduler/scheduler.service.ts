import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ActionsService } from '../actions/actions.service';
import Job, { JobType } from './models/job.model';
import SchedulerRepistory from './scheduler.repository';
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import { BatchData } from './models/batchJob.model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    private readonly jobs: SchedulerRepistory,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ActionsService))
    private readonly actions: ActionsService,
  ) {}

  async onApplicationBootstrap() {
    // start all scheduled cron jobs from database
    const jobs = await this.jobs.findAll();
    if (jobs.length === 0) return;
    console.log(`Setting up scheduled jobs... ${jobs.length} jobs pending.`);
    for (const job of jobs) {
      this.setupJob(job);
    }
  }

  async createJob(type: JobType, cron: string, data: any) {
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
    if (!this.jobs.jobExists(jobId)) {
      throw new NotFoundException(`Job with id ${id} was not found.`);
    }
    const success = await this.jobs.delete(jobId);

    // stop job
    this.schedulerRegistry.getCronJob(id).stop();
    this.schedulerRegistry.deleteCronJob(id);

    return success;
  }

  private setupJob(job: Job<any>) {
    switch (job.type) {
      case 'BATCH_ADD':
        this.setupBatch(job);
        break;
    }
  }

  private setupBatch(job: Job<BatchData>) {
    const cronJob = new CronJob(job.cron, async () => {
      const { data: ingredients } = job.data;
      await this.actions.addIngredientsBatch(
        { ingredients },
        job.data.storageId,
      );
    });

    this.schedulerRegistry.addCronJob(job._id.toString(), cronJob);
    cronJob.start();
  }
}
