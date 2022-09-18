import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';
import ActionsRepository from '../src/actions/actions.repository';
import AddDTO from '../src/actions/dto/add.dto';
import BatchDTO from '../src/actions/dto/batch.dto';
import UseDTO from '../src/actions/dto/use.dto';
import { AppModule } from '../src/app.module';
import Ingredient from '../src/ingredient/ingredient.model';
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

describe('/storage (actions)', () => {
  let app: INestApplication;

  const mockActionsRepository: Partial<ActionsRepository> = {
    storageExists: jest.fn().mockResolvedValue(true),
    addIngredient: jest.fn().mockResolvedValue(INGREDIENT),
    addBatchIngredient: jest.fn().mockResolvedValue([INGREDIENT]),
    calculateUpdatedIngredients: jest.fn().mockResolvedValue([INGREDIENT]),
    updateIngredientsAmounts: jest.fn().mockResolvedValue([INGREDIENT]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ActionsRepository)
      .useValue(mockActionsRepository)
      .overrideProvider(SchedulerService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/storage/{id}/add POST', () => {
    return request(app.getHttpServer())
      .post(`/storage/${STORAGE._id.toString()}/add`)
      .send({
        amount: INGREDIENT.amount,
        name: INGREDIENT.name,
        unit: INGREDIENT.unit,
      } as AddDTO)
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

  it('/storage/{id}/batch POST', () => {
    return request(app.getHttpServer())
      .post(`/storage/${STORAGE._id.toString()}/batch`)
      .send({
        ingredients: [
          {
            amount: INGREDIENT.amount,
            name: INGREDIENT.name,
            unit: INGREDIENT.unit,
          },
        ],
      } as BatchDTO)
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

  it('/storage/{id}/use POST', () => {
    return request(app.getHttpServer())
      .post(`/storage/${STORAGE._id.toString()}/use`)
      .send({
        ingredients: [
          {
            amount: INGREDIENT.amount,
            name: INGREDIENT.name,
            unit: INGREDIENT.unit,
          },
        ],
      } as UseDTO)
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

  afterAll(() => app.close());
});
