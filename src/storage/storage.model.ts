import { ObjectId } from 'mongodb';

/**
 * **Storage Model**
 */
export default class Storage {
  static NAME = 'storage';

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
