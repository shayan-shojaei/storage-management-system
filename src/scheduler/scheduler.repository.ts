import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import { UpdateBatchJobDTO } from './dto/updateBatchJob.dto';
import Job from './models/job.model';

@Injectable()
export default class SchedulerRepository {
  constructor(
    @InjectCollection(Job.NAME) private readonly jobs: Collection<Job<any>>,
  ) {}

  findAll() {
    return this.jobs.find().toArray();
  }

  findById(id: ObjectId) {
    return this.jobs.findOne({ _id: id });
  }

  async insert(job: Job<any>) {
    const { insertedId } = await this.jobs.insertOne(job);
    return this.jobs.findOne({ _id: insertedId });
  }

  async delete(id: ObjectId) {
    const { deletedCount } = await this.jobs.deleteOne({ _id: id });
    return deletedCount === 1;
  }

  async update(id: ObjectId, body: UpdateBatchJobDTO) {
    await this.exists(id);
    await this.jobs.updateOne(
      { _id: id },
      {
        $set: { ...body },
      },
    );

    return this.findById(id);
  }

  async exists(id: ObjectId) {
    const job = await this.jobs.findOne({ _id: id });
    if (job) return job;
    throw new NotFoundException(`Job with id ${id.toString()} was not found`);
  }
}
