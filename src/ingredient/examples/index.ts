import { ObjectId } from 'mongodb';
import Ingredient from '../ingredient.model';

const EXAMPLE_INGREDIENT_1: Ingredient = {
  _id: new ObjectId('631ec9cde869232f182c3d5f'),
  name: 'Potato',
  unit: 'KG',
  amount: 25,
  storage: new ObjectId('631d9d675237167ab2c1b75e'),
  createdAt: new Date('2022-09-11T08:33:43.458Z'),
};

const EXAMPLE_INGREDIENT_2: Ingredient = {
  _id: new ObjectId('631ec9cde869232f182c3d60'),
  name: 'Tomato',
  unit: 'G',
  amount: 2500,
  storage: new ObjectId('631d9d675237167ab2c1b75e'),
  createdAt: new Date('2022-09-11T08:33:43.458Z'),
};

export const AllIngredientsExample = {
  success: true,
  count: 2,
  data: [EXAMPLE_INGREDIENT_1, EXAMPLE_INGREDIENT_2],
};

export const SingleIngredientExample = {
  success: true,
  data: EXAMPLE_INGREDIENT_1,
};

export const TotalIngredientExample = {
  success: true,
  data: {
    name: 'Tomato',
    unit: 'G',
    amount: 34500,
  },
};
