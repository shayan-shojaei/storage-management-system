import {
  CacheInterceptor,
  CacheModule,
  INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Ingredient from '../src/ingredient/ingredient.model';
import { SchedulerService } from '../src/scheduler/scheduler.service';
import Storage, { PopulatedStorage } from '../src/storage/storage.model';
import StorageRepository from '../src/storage/storage.repository';
import StorageService from '../src/storage/storage.service';

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
      .mockImplementation((objectId: ObjectId, fill) =>
        fill ? POPULATED_STORAGE : STORAGE,
      ),
  };

  const mockStorageService: Partial<StorageService> = {
    getIngredientByName: jest.fn().mockResolvedValue(INGREDIENT),
    getAllStorages: mockStorage.findAll,
    getStorageById: jest
      .fn()
      .mockImplementation((objectId: string, fill = false) =>
        mockStorage.exists(new ObjectId(objectId), fill),
      ),
    createStorage: jest.fn().mockResolvedValue(STORAGE),
    updateStorage: jest.fn().mockResolvedValue(STORAGE),
    deleteStorage: jest.fn().mockResolvedValue({}),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageRepository)
      .useValue(mockStorage)
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
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
    return request(app.getHttpServer()).get('/storage?fill=true').expect(200);
    /* .expect({
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
      }); */
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
      .expect(200);
    /* .expect({
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
      }); */
  });

  it('/storage/{id}/{ingredient} GET', () => {
    return request(app.getHttpServer())
      .get(`/storage/${STORAGE._id.toString()}/${INGREDIENT.name}`)
      .expect(200)
      .expect({
        success: true,
        data: {
          ...INGREDIENT,
          _id: INGREDIENT._id.toString(),
          createdAt: INGREDIENT.createdAt.toISOString(),
          storage: INGREDIENT.storage.toString(),
        },
      });
  });

  it('/storage POST', () => {
    return request(app.getHttpServer())
      .post('/storage')
      .expect(201)
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

  it('/storage/{id} PUT', () => {
    return request(app.getHttpServer())
      .put(`/storage/${STORAGE._id.toString()}`)
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

  it('/storage/{id} DELETE', () => {
    return request(app.getHttpServer())
      .delete(`/storage/${STORAGE._id.toString()}`)
      .expect(200)
      .expect({
        success: true,
        data: {},
      });
  });

  afterAll(() => app.close());
});
