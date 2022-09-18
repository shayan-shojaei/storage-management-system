import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { TransformObjectId } from '../middleware/objectId.transformer';
import Storage from '../storage/storage.model';

export const UNITS = ['KG', 'G', 'L', 'ML', 'M', 'CM'] as const;
/**
 * **Measurement Units** \
 * KG (Kilograms)
 * G (Grams) \
 * L (Litres)
 * ML (Mililitres) \
 * M (Meters)
 * CM (Centimeters)
 */
export type Unit = typeof UNITS[number];

/**
 * **Ingredient Model**
 */
export default class Ingredient {
  static readonly NAME = 'ingredient';

  @TransformObjectId()
  _id: ObjectId;

  name: string;

  unit: Unit;
  amount: number;

  @Type(() => String)
  storage: ObjectId; // Reference to the storage
  createdAt: Date;

  /**
   * @param {string} name Name of ingredient (*Unique in storage*)
   * @param {Unit} unit Unit of measurement
   * @param {number} [amount=0] - Amount of ingredient
   */
  constructor(name: string, unit: Unit, storage: ObjectId, amount = 0) {
    Object.assign(this, { name, unit, amount, storage });
    this.createdAt = new Date();
  }
}

export class PopulatedIngredient implements Omit<Ingredient, 'storage'> {
  @Type(() => String)
  _id: ObjectId;

  amount: number;
  createdAt: Date;
  name: string;
  unit: 'KG' | 'G' | 'L' | 'ML' | 'M' | 'CM';
  storage: Storage;

  constructor(ingredient: Ingredient, storage: Storage) {
    Object.assign(this, { ...ingredient, storage });
  }
}
