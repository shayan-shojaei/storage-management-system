import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import Storage from '../storage/storage.model';
import Ingredient from '../ingredient/ingredient.model';
import ActionsRepository from './actions.repository';
import { ActionsService } from './actions.service';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';
import UseDTO from './dto/use.dto';

const ingredientDTO: AddDTO = {
  name: 'Ingredient Name',
  amount: 400,
  unit: 'G',
};

const batchIngredientDTO: BatchDTO | UseDTO = {
  ingredients: [
    { name: 'Ing1', amount: 200, unit: 'G' },
    { name: 'Ing2', amount: 4, unit: 'KG' },
    { name: 'Ing3', amount: 10, unit: 'L' },
  ],
};

const storageId = new ObjectId();

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
    getIngredientsInStorage: jest.fn().mockImplementation(
      async (storage: Storage): Promise<Ingredient[]> =>
        storage.ingredients.map(
          (ingredient) =>
            ({
              amount: 0,
              name: '',
              unit: 'G',
              _id: new ObjectId(ingredient),
              createdAt: new Date(),
              storage: new ObjectId(storage._id),
            } as Ingredient),
        ),
    ),
    calculateUpdatedIngredients: jest.fn().mockImplementation(
      async (batch: UseDTO, storage: Storage): Promise<Ingredient[]> =>
        batch.ingredients.map(
          (ingredient) =>
            ({
              ...ingredient,
              _id: new ObjectId(),
              createdAt: new Date(),
              storage: storage._id,
            } as Ingredient),
        ),
    ),
    updateIngredientsAmounts: jest
      .fn()
      .mockImplementation(
        async (ingredients: Ingredient[]): Promise<Ingredient[]> => ingredients,
      ),
    storageExists: jest.fn().mockImplementation(
      async (id: ObjectId): Promise<Storage> =>
        ({
          _id: id,
          createdAt: new Date(),
          ingredients: [],
          name: '',
        } as Storage),
    ),
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

  it('should create and add single ingredient to storage', async () => {
    expect(await service.addIngredient(ingredientDTO, storageId)).toEqual({
      ...ingredientDTO,
      _id: expect.any(ObjectId),
      storage: storageId,
      createdAt: expect.any(Date),
    });
  });

  it('should add batch of ingredients to storage', async () => {
    expect(
      await service.addIngredientsBatch(batchIngredientDTO, storageId),
    ).toEqual(
      batchIngredientDTO.ingredients.map((ingredient) => ({
        ...ingredient,
        _id: expect.any(ObjectId),
        storage: storageId,
        createdAt: expect.any(Date),
      })),
    );
  });

  it('should remove a batch of ingredients from storage', async () => {
    expect(
      await service.useIngredientsBatch(batchIngredientDTO, storageId),
    ).toEqual(
      batchIngredientDTO.ingredients.map(
        (ingredient) =>
          ({
            ...ingredient,
            _id: expect.any(ObjectId),
            storage: storageId,
            createdAt: expect.any(Date),
          } as Ingredient),
      ),
    );
  });
});
