import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(__dirname, 'data');

export const getCollectionData = (collection: string): Array<any> => {
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  const json = fs.readFileSync(filePath).toString();
  return JSON.parse(json);
};

console.log();
