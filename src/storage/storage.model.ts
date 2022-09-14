import { ObjectId } from 'mongodb';
import Ingredient from '../ingredient/ingredient.model';

/**
 * **Storage Model**
 */
export default class Storage {
  static readonly NAME = 'storage';

  _id: ObjectId;
  name: string;
  ingredients: ObjectId[]; // Reference to Ingredients
  createdAt: Date;

  /**
   * @param {string} name Name of storage
   * @param {ObjectId[]} ingredients List of ingredients in storage
   */
  constructor(name: string, ingredients: ObjectId[] = []) {
    this.name = name;
    this.ingredients = ingredients;
    this.createdAt = new Date();
  }
}

export class PopulatedStorage implements Omit<Storage, 'ingredients'> {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  ingredients: Ingredient[];

  constructor(storage: Storage, ingredients: Ingredient[] = []) {
    this._id = storage._id;
    this.name = storage.name;
    this.createdAt = storage.createdAt;
    this.name = storage.name;
    this.ingredients = ingredients;
  }
}
