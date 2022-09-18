import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Ingredient from '../src/ingredient/ingredient.model';
import { SchedulerService } from '../src/scheduler/scheduler.service';
import Storage, { PopulatedStorage } from '../src/storage/storage.model';
import StorageRepository from '../src/storage/storage.repository';

const STORAGE_ID = new ObjectId();

const INGREDIENT: Ingredient = {
  _id: new ObjectId(),
  amount: 100,
  name: 'Ingredient',
  createdAt: new Date(),
  storage: STORAGE_ID,
  unit: 'KG',
};

const STORAGE: Storage = {
  _id: STORAGE_ID,
  createdAt: new Date(),
  ingredients: [INGREDIENT._id],
  name: 'Storage',
};

const POPULATED_STORAGE: PopulatedStorage = {
  _id: STORAGE_ID,
  createdAt: new Date(),
  ingredients: [{ ...INGREDIENT }],
  name: 'Storage',
};

describe('/storage', () => {
  let app: INestApplication;

  const mockStorage: Partial<StorageRepository> = {
    findAll: jest
      .fn()
      .mockImplementation((fill) => (fill ? [POPULATED_STORAGE] : [STORAGE])),
    exists: jest
      .fn()
      .mockImplementation((objectId, fill) =>
        fill ? POPULATED_STORAGE : STORAGE,
      ),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageRepository)
      .useValue(mockStorage)
      .overrideProvider(SchedulerService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/storage GET', () => {
    return request(app.getHttpServer())
      .get('/storage')
      .expect(200)
      .expect({
        success: true,
        count: 1,
        data: [
          {
            _id: STORAGE._id.toString(),
            createdAt: STORAGE.createdAt.toISOString(),
            name: STORAGE.name,
            ingredients: [INGREDIENT._id.toString()],
          },
        ],
      });
  });

  it('/storage?fill=true GET', () => {
    return request(app.getHttpServer())
      .get('/storage?fill=true')
      .expect(200)
      .expect({
        success: true,
        count: 1,
        data: [
          {
            _id: STORAGE._id.toString(),
            createdAt: STORAGE.createdAt.toISOString(),
            ingredients: expect.arrayContaining([
              expect.objectContaining({
                _id: INGREDIENT._id.toString(),
                storage: undefined,
              }),
            ]),
            name: STORAGE.name,
          },
        ],
      });
  });

  it('/storage/{id} GET', () => {
    return request(app.getHttpServer())
      .get(`/storage/${STORAGE._id.toString()}`)
      .expect(200)
      .expect({
        success: true,
        data: {
          _id: STORAGE._id.toString(),
          createdAt: STORAGE.createdAt.toISOString(),
          ingredients: [INGREDIENT._id.toString()],
          name: STORAGE.name,
        },
      });
  });

  it('/storage/{id}?fill=true GET', () => {
    return request(app.getHttpServer())
      .get(`/storage/${STORAGE._id.toString()}?fill=true`)
      .expect(200)
      .expect({
        success: true,
        data: {
          _id: STORAGE._id.toString(),
          createdAt: STORAGE.createdAt.toISOString(),
          ingredients: [
            expect.objectContaining({
              _id: INGREDIENT._id.toString(),
              storage: undefined,
            }),
          ],
          name: STORAGE.name,
        },
      });
  });

  afterAll(() => app.close());
});
