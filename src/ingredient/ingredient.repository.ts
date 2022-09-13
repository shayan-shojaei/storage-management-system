import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import Ingredient from './ingredient.model';

@Injectable()
export default class IngredientRepository {
  constructor(
    @InjectCollection(Ingredient.NAME)
    private readonly ingredient: Collection<Ingredient>,
  ) {}

  findAll() {
    return this.ingredient.find().toArray();
  }

  findByName(name: string) {
    return this.ingredient.find({ name }).toArray();
  }

  async update(id: ObjectId, update: UpdateIngredientDTO) {
    // Update
    await this.ingredient.updateOne(
      { _id: id },
      {
        $set: { ...update },
      },
    );

    // Return updated value
    return this.ingredient.findOne({ _id: id });
  }

  async updateByName(name: string, update: UpdateIngredientByNameDTO) {
    // Update
    await this.ingredient.updateMany(
      { name },
      {
        $set: { ...update },
      },
    );

    // TODO: Update previously added items with names matching the updated name and merge if in the same storage

    // get new name if it has been updated
    const newName = update.name !== undefined ? update.name : name;

    return this.ingredient.find({ name: newName }).toArray();
  }

  async findInStorage(storageId: ObjectId, name: string) {
    return this.ingredient.findOne({ storage: storageId, name });
  }

  async nameExists(name: string) {
    const numOfIngredients = await this.ingredient.countDocuments({ name });
    return numOfIngredients > 0;
  }

  /**
   * Checks whether ingredients with given id exists or not.
   * @param {ObjectId} objectId Ingredient ObjectId
   * @returns {Promise<Ingredient>} returns the ingredients if it exists
   */
  async exists(objectId: ObjectId) {
    const ingredients = await this.ingredient.findOne({ _id: objectId });

    // Check if ingredients exists
    if (!ingredients)
      throw new NotFoundException(
        `Ingredient with id ${objectId.toString()} was not found.`,
      );

    return ingredients;
  }
}
