import { ObjectId } from 'mongodb';

export const JOB_TYPES = ['BATCH_ADD'] as const;
export type JobType = typeof JOB_TYPES[number];

export default class Job<JobData> {
  static readonly NAME = 'jobs';

  _id: ObjectId;
  type: JobType;
  data: JobData;
  cron: string;
  createdAt: Date;

  constructor(type: JobType, data: JobData, cron: string) {
    this.data = data;
    this.cron = cron;
    this.type = type;
    this.createdAt = new Date();
  }
}
