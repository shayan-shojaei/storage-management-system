import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import Ingredient from '../ingredient/ingredient.model';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';
import UseDTO from './dto/use.dto';

const ADD_INGREDIENT_1: AddDTO = {
  name: 'I1',
  amount: 500,
  unit: 'G',
};
const ADD_INGREDIENT_2: AddDTO = {
  name: 'I1',
  amount: 500,
  unit: 'G',
};

const BATCH_INGREDIENT: BatchDTO | UseDTO = {
  ingredients: [ADD_INGREDIENT_1, ADD_INGREDIENT_2],
};

const STORAGE_1 = '631d9d675237167ab2c1b75e';

describe('ActionsController', () => {
  let controller: ActionsController;

  const mockActionsService: Partial<ActionsService> = {
    addIngredient: jest.fn().mockImplementation(
      async (dto: AddDTO, storage: string) =>
        ({
          ...dto,
          _id: new ObjectId(),
          createdAt: new Date(),
          storage: new ObjectId(storage),
        } as Ingredient),
    ),
    addIngredientsBatch: jest
      .fn()
      .mockImplementation(async (dto: BatchDTO, storage: string) =>
        dto.ingredients.map(
          (ingredient) =>
            ({
              ...ingredient,
              _id: new ObjectId(),
              createdAt: new Date(),
              storage: new ObjectId(storage),
            } as Ingredient),
        ),
      ),
    useIngredientsBatch: jest
      .fn()
      .mockImplementation(async (dto: BatchDTO, storage: string) =>
        dto.ingredients.map(
          (ingredient) =>
            ({
              ...ingredient,
              _id: new ObjectId(),
              createdAt: new Date(),
              storage: new ObjectId(storage),
            } as Ingredient),
        ),
      ),
    checkStorage: jest
      .fn()
      .mockImplementation((storageId: ObjectId) => ObjectId.isValid(storageId)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [{ provide: ActionsService, useValue: mockActionsService }],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should add ingredient', async () => {
      const response = await controller.add(STORAGE_1, ADD_INGREDIENT_1);
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toEqual({
        ...ADD_INGREDIENT_1,
        _id: expect.any(ObjectId),
        storage: new ObjectId(STORAGE_1),
        createdAt: expect.any(Date),
      } as Ingredient);
    });
  });

  describe('batch', () => {
    it('should add a batch of ingredients', async () => {
      const response = await controller.addBatch(STORAGE_1, BATCH_INGREDIENT);
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toEqual([
        {
          ...ADD_INGREDIENT_1,
          _id: expect.any(ObjectId),
          storage: new ObjectId(STORAGE_1),
          createdAt: expect.any(Date),
        },
        {
          ...ADD_INGREDIENT_2,
          _id: expect.any(ObjectId),
          storage: new ObjectId(STORAGE_1),
          createdAt: expect.any(Date),
        },
      ] as Ingredient[]);
    });
  });

  describe('use', () => {
    it('should use a batch of ingredients and update database with reduced amounts', async () => {
      const response = await controller.useBatch(STORAGE_1, BATCH_INGREDIENT);
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.data).toEqual([
        {
          ...ADD_INGREDIENT_1,
          _id: expect.any(ObjectId),
          storage: new ObjectId(STORAGE_1),
          createdAt: expect.any(Date),
        },
        {
          ...ADD_INGREDIENT_2,
          _id: expect.any(ObjectId),
          storage: new ObjectId(STORAGE_1),
          createdAt: expect.any(Date),
        },
      ] as Ingredient[]);
    });
  });
});
