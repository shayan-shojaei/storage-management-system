import { ObjectId } from 'mongodb';

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
  static NAME = 'ingredient';

  _id: ObjectId;
  name: string;
  unit: Unit;
  amount: number;
  storage: ObjectId; // Reference to the storage
  createdAt: Date;

  /**
   * @param {string} name Name of ingredient (*Unique in storage*)
   * @param {Unit} unit Unit of measurement
   * @param {number} [amount=0] - Amount of ingredient
   */
  constructor(name: string, unit: Unit, storage: ObjectId, amount = 0) {
    this.name = name;
    this.unit = unit;
    this.amount = amount;
    this.storage = storage;
    this.createdAt = new Date();
  }
}
