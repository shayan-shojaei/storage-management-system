import { ObjectId } from 'mongodb';
import Ingredient from 'src/ingredient/ingredient.model';

/**
 * **Storage Model**
 */
export default class Storage {
  static NAME = 'storage';

  _id: ObjectId;
  name: string;
  ingredients: Ingredient[];
  createdAt: Date;

  /**
   * @param {string} name Name of storage
   * @param {Ingredient[]} ingredients List of ingredients in storage
   */
  constructor(name: string, ingredients: Ingredient[] = []) {
    this.name = name;
    this.ingredients = ingredients;
    this.createdAt = new Date();
  }
}
