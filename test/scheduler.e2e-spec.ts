import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import AddDTO from '../src/actions/dto/add.dto';
import { AppModule } from '../src/app.module';
import CreateJobDTO from '../src/scheduler/dto/createJob.dto';
import { UpdateBatchJobDTO } from '../src/scheduler/dto/updateBatchJob.dto';
import { BatchData } from '../src/scheduler/models/batchJob.model';
import Job from '../src/scheduler/models/job.model';
import { SchedulerService } from '../src/scheduler/scheduler.service';

const STORAGE_ID = new ObjectId();

const ADD: AddDTO = {
  amount: 100,
  name: 'Ingredient',
  unit: 'KG',
};

const JOB: Job<BatchData> = {
  _id: new ObjectId(),
  createdAt: new Date(),
  type: 'BATCH_ADD',
  cron: '* * * * * *',
  data: {
    data: [ADD],
    storageId: STORAGE_ID.toString(),
  },
};

describe('/scheduler', () => {
  let app: INestApplication;

  const mockSchedulerService: Partial<SchedulerService> = {
    onApplicationBootstrap: jest.fn(),
    create: jest.fn().mockResolvedValue(JOB),
    findAll: jest.fn().mockResolvedValue([JOB]),
    delete: jest.fn().mockResolvedValue({}),
    findById: jest.fn().mockResolvedValue(JOB),
    update: jest.fn().mockResolvedValue(JOB),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SchedulerService)
      .useValue(mockSchedulerService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/scheduler GET', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/scheduler`)
      .expect(200);

    expect(body).toEqual({
      success: true,
      count: 1,
      data: [
        {
          ...JOB,
          _id: JOB._id.toString(),
          createdAt: JOB.createdAt.toISOString(),
        },
      ],
    });
  });
  it('/scheduler/{id} GET', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/scheduler/${JOB._id.toString()}`)
      .expect(200);

    expect(body).toEqual({
      success: true,
      data: {
        ...JOB,
        _id: JOB._id.toString(),
        createdAt: JOB.createdAt.toISOString(),
      },
    });
  });

  it('/scheduler POST', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/scheduler`)
      .send({
        cron: JOB.cron,
        type: JOB.type,
        data: {
          storageId: JOB.data.storageId,
          data: JOB.data.data,
        },
      } as CreateJobDTO<BatchData>)
      .expect(201);

    expect(body).toEqual({
      success: true,
      data: {
        ...JOB,
        _id: JOB._id.toString(),
        createdAt: JOB.createdAt.toISOString(),
      },
    });
  });

  it('/scheduler/{id} PUT', async () => {
    const { body } = await request(app.getHttpServer())
      .put(`/scheduler/${JOB._id.toString()}`)
      .send({
        type: 'BATCH_ADD',
      } as UpdateBatchJobDTO)
      .expect(200);

    expect(body).toEqual({
      success: true,
      data: {
        ...JOB,
        _id: JOB._id.toString(),
        createdAt: JOB.createdAt.toISOString(),
      },
    });
  });

  it('/scheduler/{id} DELETE', async () => {
    const { body } = await request(app.getHttpServer())
      .delete(`/scheduler/${JOB._id.toString()}`)
      .expect(200);

    expect(body).toEqual({
      success: true,
      data: {},
    });
  });

  afterAll(() => app.close());
});
