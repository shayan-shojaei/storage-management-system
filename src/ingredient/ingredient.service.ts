import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import { unitConverter } from '../utils/unitConverter';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import Ingredient from './ingredient.model';

@Injectable()
export default class IngredientService {
  constructor(
    @InjectCollection(Ingredient.NAME)
    private readonly ingredient: Collection<Ingredient>,
  ) {}

  async getAllIngredients() {
    return this.ingredient.find().toArray();
  }

  async getIngredientById(id: string) {
    const objectId = new ObjectId(id);
    const ingredient = await this.ingredientExists(objectId);
    return ingredient;
  }

  async getIngredientsByName(name: string) {
    const ingredients = await this.ingredient.find({ name }).toArray();
    return ingredients;
  }

  async updateIngredientById(id: string, update: UpdateIngredientDTO) {
    const objectId = new ObjectId(id);
    update.storage = new ObjectId(update.storage);
    await this.ingredientExists(objectId);

    // Update
    await this.ingredient.updateOne(
      { _id: objectId },
      {
        $set: { ...update },
      },
    );

    return this.ingredient.findOne({ _id: objectId });
  }

  async updateIngredientByName(
    name: string,
    update: UpdateIngredientByNameDTO,
  ) {
    // Check if any ingredients with given name exist
    const numOfIngredients = await this.ingredient.countDocuments({ name });
    if (numOfIngredients === 0) {
      throw new NotFoundException(`No ingredients found with name ${name}`);
    }

    // Update
    await this.ingredient.updateMany(
      { name },
      {
        $set: { ...update },
      },
    );

    const newName = update.name !== undefined ? update.name : name;
    return this.ingredient.find({ name: newName }).toArray();
  }

  async getTotalIngredientData(name: string) {
    // get all ingredients by name
    const ingredients = await this.ingredient.find({ name }).toArray();
    if (ingredients.length === 0) {
      throw new NotFoundException(
        `No ingredients were found with name ${name}`,
      );
    }

    // reduce all to single object, converting the units when reducing
    const total = ingredients.reduce((prev, current) => {
      if (prev === undefined) {
        return { ...current };
      }
      return {
        ...prev,
        amount:
          prev.amount + unitConverter(current.amount, current.unit, prev.unit),
      };
    }, undefined);

    total._id = undefined;
    total.storage = undefined;
    total.createdAt = undefined;

    return total;
  }

  /**
   * Checks whether ingredient with given id exists or not.
   * @param {ObjectId} objectId Ingredient ObjectId
   * @returns {Promise<Ingredient>} returns the ingredient if it exists
   */
  private async ingredientExists(objectId: ObjectId) {
    const ingredient = await this.ingredient.findOne({ _id: objectId });

    // Check if ingredient exists
    if (!ingredient)
      throw new NotFoundException(
        `Ingredient with id ${objectId.toString()} was not found.`,
      );

    return ingredient;
  }
}
