import { BadRequestException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import { unitConverter } from '../utils/unitConverter';
import Ingredient from '../ingredient/ingredient.model';
import Storage from '../storage/storage.model';
import AddDTO from './dto/add.dto';
import BatchDTO from './dto/batch.dto';
import UseDTO from './dto/use.dto';

@Injectable()
export default class ActionsRepository {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storage: Collection<Storage>,
    @InjectCollection(Ingredient.NAME)
    private readonly ingredient: Collection<Ingredient>,
  ) {}

  async addIngredient(add: AddDTO, storage: ObjectId) {
    const ingredient = await this.getOrCreateIngredient(add, storage);

    // Convert amount to ingredient's initial unit
    const amountToAdd = unitConverter(add.amount, add.unit, ingredient.unit);

    await this.ingredient.updateOne(
      { _id: ingredient._id },
      {
        $set: {
          amount: ingredient.amount + amountToAdd,
        },
      },
    );

    return this.ingredient.findOne({ _id: ingredient._id });
  }

  addBatchIngredient(add: BatchDTO, storage: ObjectId) {
    // check for duplicate names in list of ingredients and merge
    const mergedIngredients: Record<string, AddDTO> = {};
    for (const ingredient of add.ingredients) {
      if (Object.keys(mergedIngredients).includes(ingredient.name)) {
        const targetUnit = mergedIngredients[ingredient.name].unit;
        const { amount, unit } = ingredient;
        const amountToAdd = unitConverter(amount, unit, targetUnit);
        mergedIngredients[ingredient.name].amount += amountToAdd;
        continue;
      }
      mergedIngredients[ingredient.name] = ingredient;
    }
    const ingredients = Object.values(mergedIngredients);
    // add each ingredient and map result to list
    return Promise.all(
      ingredients.map((ingredient) => this.addIngredient(ingredient, storage)),
    );
  }

  async getIngredientsInStorage(storage: Storage) {
    return this.ingredient
      .find({
        _id: {
          $in: storage.ingredients,
        },
      })
      .toArray();
  }

  async calculateUpdatedIngredients(batch: UseDTO, storage: Storage) {
    // get ingredients in storage
    const ingredients = await this.getIngredientsInStorage(storage);

    const usedIngredients = [];

    console.log(ingredients);

    // check if all ingredients amounts are sufficient in storage
    for (const ingredient of batch.ingredients) {
      const ingredientInStorage = ingredients.find(
        (ing) => ing.name === ingredient.name,
      );

      // Not in storage
      if (!ingredientInStorage) {
        throw new BadRequestException(
          `Ingredient with name ${
            ingredient.name
          } is not available in storage ${storage._id.toString()}`,
        );
      }

      // convert unit
      ingredientInStorage.amount = unitConverter(
        ingredientInStorage.amount,
        ingredientInStorage.unit,
        ingredient.unit,
      );

      // insufficient amount
      if (ingredient.amount > ingredientInStorage.amount) {
        throw new BadRequestException(
          `Insufficient ${ingredient.name} in storage.`,
        );
      }

      // update amounts
      ingredientInStorage.amount -= ingredient.amount;
      usedIngredients.push(ingredientInStorage);
    }

    console.log(usedIngredients);
    return usedIngredients;
  }

  async updateIngredientsAmounts(ingredients: Ingredient[]) {
    // update
    await Promise.all(
      ingredients.map((ingredient) =>
        this.ingredient.updateOne(
          { _id: ingredient._id },
          {
            $set: {
              amount: ingredient.amount,
            },
          },
        ),
      ),
    );

    // return updated values
    return Promise.all(
      ingredients.map((ingredient) =>
        this.ingredient.findOne({ _id: ingredient._id }),
      ),
    );
  }

  async getOrCreateIngredient(add: AddDTO, storage: ObjectId) {
    const ingredient = await this.ingredient.findOne({
      name: add.name,
      storage: storage,
    });
    if (ingredient) {
      // Ingredient already exists in storage
      return ingredient;
    }

    // create new ingredient
    const newIngredient = new Ingredient(add.name, add.unit, storage);
    const { insertedId } = await this.ingredient.insertOne(newIngredient);

    // add ingredient to storage
    await this.storage.updateOne(
      { _id: storage },
      {
        $push: {
          ingredients: insertedId,
        },
      },
    );
    return this.ingredient.findOne({ _id: insertedId });
  }

  async storageExists(id: ObjectId) {
    const storage = await this.storage.findOne({ _id: id });
    return storage;
  }
}
