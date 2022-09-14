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
    Object.assign(this, { name, ingredients });
    this.createdAt = new Date();
  }
}

export class PopulatedStorage implements Omit<Storage, 'ingredients'> {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  ingredients: Ingredient[];

  constructor(storage: Storage, ingredients: Ingredient[] = []) {
    Object.assign(this, { ...storage, ingredients });
  }
}
