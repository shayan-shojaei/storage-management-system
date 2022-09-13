import { Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import Job from './models/job.model';

@Injectable()
export default class SchedulerRepository {
  constructor(
    @InjectCollection(Job.NAME) private readonly jobs: Collection<Job<any>>,
  ) {}

  findAll() {
    return this.jobs.find().toArray();
  }

  async insert(job: Job<any>) {
    const { insertedId } = await this.jobs.insertOne(job);
    return this.jobs.findOne({ _id: insertedId });
  }

  async delete(id: ObjectId) {
    const { deletedCount } = await this.jobs.deleteOne({ _id: id });
    return deletedCount === 1;
  }

  async jobExists(id: ObjectId) {
    const job = await this.jobs.findOne({ _id: id });
    if (job) return true;
    return false;
  }
}
