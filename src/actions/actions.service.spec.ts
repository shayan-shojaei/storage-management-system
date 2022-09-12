import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import Ingredient from '../ingredient/ingredient.model';
import ActionsRepository from './actions.repository';
import { ActionsService } from './actions.service';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';

const ingredientDTO: AddDTO = {
  name: 'Ingredient Name',
  amount: 400,
  unit: 'G',
};

const batchIngredientDTO: BatchDTO = {
  ingredients: [
    { name: 'Ing1', amount: 200, unit: 'G' },
    { name: 'Ing2', amount: 4, unit: 'KG' },
    { name: 'Ing3', amount: 10, unit: 'L' },
  ],
};

const storageId = '631d9d675237167ab2c1b75e';

describe('ActionsService', () => {
  let service: ActionsService;

  const actionsRepoMock: Partial<ActionsRepository> = {
    addIngredient: jest.fn().mockImplementation(
      async (dto: AddDTO, storage: ObjectId): Promise<Ingredient> => ({
        ...dto,
        _id: new ObjectId(),
        createdAt: new Date(),
        storage,
      }),
    ),
    addBatchIngredient: jest.fn().mockImplementation(
      async (batch: BatchDTO, storage: ObjectId): Promise<Ingredient[]> =>
        batch.ingredients.map((ingredient) => ({
          ...ingredient,
          _id: new ObjectId(),
          createdAt: new Date(),
          storage,
        })),
    ),
    storageExists: jest.fn().mockImplementation(async () => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: ActionsRepository,
          useValue: actionsRepoMock,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add single ingredient to storage', () => {
    it('should create and add single ingredient to storage', async () => {
      expect(await service.addIngredient(ingredientDTO, storageId)).toEqual({
        ...ingredientDTO,
        _id: expect.any(ObjectId),
        storage: new ObjectId(storageId),
        createdAt: expect.any(Date),
      });
    });
  });

  describe('add batch of ingredients to storage', () => {
    it('should create and add single ingredient to storage', async () => {
      expect(
        await service.addIngredientsBatch(batchIngredientDTO, storageId),
      ).toEqual(
        batchIngredientDTO.ingredients.map((ingredient) => ({
          ...ingredient,
          _id: expect.any(ObjectId),
          storage: new ObjectId(storageId),
          createdAt: expect.any(Date),
        })),
      );
    });
  });
});
