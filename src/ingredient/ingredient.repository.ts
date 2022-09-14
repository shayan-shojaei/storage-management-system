import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import Storage from 'src/storage/storage.model';
import StorageRepository from '../storage/storage.repository';
import UpdateIngredientDTO from './dto/updateIngredient.dto';
import UpdateIngredientByNameDTO from './dto/updateIngredientByName.dto';
import Ingredient, { PopulatedIngredient } from './ingredient.model';

@Injectable()
export default class IngredientRepository {
  constructor(
    @InjectCollection(Ingredient.NAME)
    private readonly ingredient: Collection<Ingredient>,
    @Inject(forwardRef(() => StorageRepository))
    private readonly storage: StorageRepository,
  ) {}

  async findAll(fill = false) {
    const ingredients = await this.ingredient.find().toArray();
    return fill ? this.populateArray(ingredients) : ingredients;
  }

  findById(id: ObjectId) {
    return this.ingredient.findOne({ _id: id });
  }

  async findByName(name: string, fill = false) {
    const ingredients = await this.ingredient.find({ name }).toArray();
    return fill ? this.populateArray(ingredients) : ingredients;
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
   * Populate storage
   * @param {Ingredient} ingredient the ingredient to populate with storage data
   * @returns {PopulatedIngredient} ingredient with populated storage data
   */
  async populate(ingredient: Ingredient): Promise<PopulatedIngredient> {
    const storage = (await this.storage.exists(ingredient.storage)) as Storage;
    const populatedIngredient = new PopulatedIngredient(ingredient, storage);
    return populatedIngredient;
  }

  async populateArray(
    ingredients: Ingredient[],
  ): Promise<PopulatedIngredient[]> {
    const populated = await Promise.all(
      ingredients.map(async (ingredient) => {
        const populatedIngredient = await this.populate(ingredient);
        return populatedIngredient;
      }),
    );
    return populated;
  }

  /**
   * Checks whether ingredients with given id exists or not.
   * @param {ObjectId} objectId Ingredient ObjectId
   * @returns {Promise<Ingredient>} returns the ingredients if it exists
   */
  async exists(objectId: ObjectId, fill = false) {
    const ingredient = await this.ingredient.findOne({ _id: objectId });

    // Check if ingredients exists
    if (!ingredient)
      throw new NotFoundException(
        `Ingredient with id ${objectId.toString()} was not found.`,
      );

    return fill ? this.populate(ingredient) : ingredient;
  }
}
