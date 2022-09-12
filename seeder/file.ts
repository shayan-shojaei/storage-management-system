import * as fs from 'fs/promises';
import { ObjectId } from 'mongodb';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, 'data');

const getCollectionData = async (collection: string): Promise<Array<any>> => {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  const json = (await fs.readFile(filePath)).toString();
  return JSON.parse(json);
};

export const getStorages = async () => {
  let data = await getCollectionData('storage');
  data = data.map((storage) => {
    storage._id = new ObjectId(storage._id);
    storage.ingredients = storage.ingredients.map(
      (ingredient: string) => new ObjectId(ingredient),
    );
    return { ...storage };
  });
  return data;
};
export const getIngredients = async () => {
  let data = await getCollectionData('ingredient');
  data = data.map((ingredient) => {
    ingredient._id = new ObjectId(ingredient._id);
    ingredient.storage = new ObjectId(ingredient.storage);
    return { ...ingredient };
  });
  return data;
};
