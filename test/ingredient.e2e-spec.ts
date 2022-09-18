import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Ingredient, {
  PopulatedIngredient,
} from '../src/ingredient/ingredient.model';
import IngredientRepository from '../src/ingredient/ingredient.repository';
import IngredientService from '../src/ingredient/ingredient.service';
import { SchedulerService } from '../src/scheduler/scheduler.service';
import Storage from '../src/storage/storage.model';

const INGREDIENT_ID = new ObjectId();

const STORAGE: Storage = {
  _id: new ObjectId(),
  createdAt: new Date(),
  name: 'Storage',
  ingredients: [INGREDIENT_ID],
};

const INGREDIENT: Ingredient = {
  _id: INGREDIENT_ID,
  amount: 100,
  name: 'Ingredient',
  createdAt: new Date(),
  storage: STORAGE._id,
  unit: 'KG',
};

const POPULATED_INGREDIENT: PopulatedIngredient = {
  ...INGREDIENT,
  storage: STORAGE,
};

describe('/ingredient', () => {
  let app: INestApplication;

  const mockIngredientRepository: Partial<IngredientRepository> = {
    findAll: jest
      .fn()
      .mockImplementation((fill = false) =>
        fill ? [POPULATED_INGREDIENT] : [INGREDIENT],
      ),
    findById: jest.fn().mockResolvedValue(INGREDIENT),
    exists: jest
      .fn()
      .mockImplementation((id: ObjectId, fill = false) =>
        fill ? POPULATED_INGREDIENT : INGREDIENT,
      ),
    update: jest.fn().mockResolvedValue(INGREDIENT),
    findByName: jest.fn().mockResolvedValue([INGREDIENT]),
    nameExists: jest.fn().mockResolvedValue(true),
    updateByName: jest.fn().mockResolvedValue([INGREDIENT]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IngredientRepository)
      .useValue(mockIngredientRepository)
      .overrideProvider(SchedulerService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ingredient GET', () => {
    return request(app.getHttpServer())
      .get('/ingredient')
      .expect(200)
      .expect({
        success: true,
        count: 1,
        data: [
          {
            ...INGREDIENT,
            _id: INGREDIENT._id.toString(),
            createdAt: INGREDIENT.createdAt.toISOString(),
            storage: INGREDIENT.storage.toString(),
          },
        ],
      });
  });

  it('/ingredient?fill=true GET', () => {
    return request(app.getHttpServer())
      .get('/ingredient?fill=true')
      .expect(200);
    /* .expect({
        success: true,
        count: 1,
        data: [
          {
            ...INGREDIENT,
            _id: INGREDIENT._id.toString(),
            createdAt: INGREDIENT.createdAt.toISOString(),
            storage: expect.objectContaining({
              _id: STORAGE._id.toString(),
            }),
          },
        ],
      }); */
  });

  it('/ingredient/{id} GET', () => {
    return request(app.getHttpServer())
      .get(`/ingredient/${INGREDIENT._id.toString()}`)
      .expect(200)
      .expect({
        success: true,
        data: {
          ...INGREDIENT,
          _id: INGREDIENT._id.toString(),
          createdAt: INGREDIENT.createdAt.toISOString(),
          storage: STORAGE._id.toString(),
        },
      });
  });

  it('/ingredient/{id}?fill=true GET', () => {
    return request(app.getHttpServer())
      .get(`/ingredient/${INGREDIENT._id.toString()}?fill=true`)
      .expect(200);
    /* .expect({
        success: true,
        data: {
          ...INGREDIENT,
          _id: INGREDIENT._id.toString(),
          createdAt: INGREDIENT.createdAt.toISOString(),
          storage: {
            ...STORAGE,
            _id: STORAGE._id.toString(),
            createdAt: STORAGE.createdAt.toISOString(),
            ingredients: undefined,
          },
        },
      }); */
  });

  it('/ingredient/{id} PUT', () => {
    return request(app.getHttpServer())
      .put(`/ingredient/${INGREDIENT._id.toString()}`)
      .expect(200)
      .expect({
        success: true,
        data: {
          ...INGREDIENT,
          _id: INGREDIENT._id.toString(),
          createdAt: INGREDIENT.createdAt.toISOString(),
          storage: STORAGE._id.toString(),
        },
      });
  });

  it('/ingredient/{name}/total GET', () => {
    return request(app.getHttpServer())
      .get(`/ingredient/${INGREDIENT.name}/total`)
      .expect(200)
      .expect({
        success: true,
        data: {
          name: INGREDIENT.name,
          amount: INGREDIENT.amount,
          unit: INGREDIENT.unit,
        },
      });
  });

  it('/ingredient/{name}/all PUT', () => {
    return request(app.getHttpServer())
      .put(`/ingredient/${INGREDIENT.name}/all`)
      .expect(200)
      .expect({
        success: true,
        count: 1,
        data: [
          {
            ...INGREDIENT,
            _id: INGREDIENT._id.toString(),
            createdAt: INGREDIENT.createdAt.toISOString(),
            storage: STORAGE._id.toString(),
          },
        ],
      });
  });

  afterAll(() => app.close());
});
