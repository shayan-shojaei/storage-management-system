import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { unitConverter } from '../utils/unitConverter';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import Ingredient from './ingredient.model';
import IngredientRepository from './ingredient.repository';

@Injectable()
export default class IngredientService {
  constructor(private readonly ingredients: IngredientRepository) {}

  getAllIngredients(fill = false) {
    return this.ingredients.findAll(fill);
  }

  async getIngredientById(id: string, fill = false) {
    const objectId = new ObjectId(id);
    const ingredients = await this.ingredients.exists(objectId, fill);
    return ingredients;
  }

  async getIngredientsByName(name: string, fill = false) {
    return this.ingredients.findByName(name, fill);
  }

  async updateIngredientById(id: string, update: UpdateIngredientDTO) {
    const objectId = new ObjectId(id);
    update.storage = new ObjectId(update.storage); // convert string to objectId

    await this.ingredients.exists(objectId);

    return this.ingredients.update(objectId, update);
  }

  async updateIngredientByName(
    name: string,
    update: UpdateIngredientByNameDTO,
  ) {
    // Check if any ingredients with given name exist
    if (!(await this.ingredients.nameExists(name))) {
      throw new NotFoundException(`No ingredients found with name ${name}`);
    }

    return this.ingredients.updateByName(name, update);
  }

  async getTotalIngredientData(name: string) {
    // get all ingredients by name
    const ingredients = (await this.ingredients.findByName(
      name,
    )) as Ingredient[];

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

      // convert amounts to single unit
      return {
        ...prev,
        amount:
          prev.amount + unitConverter(current.amount, current.unit, prev.unit),
      };
    }, undefined);

    // remove non-shared fields
    total._id = undefined;
    total.storage = undefined;
    total.createdAt = undefined;

    return total;
  }
}
