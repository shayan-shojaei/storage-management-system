import { ObjectId } from 'mongodb';
import { connect } from './database';
import { getIngredients, getStorages } from './file';

// Connect database
const client = connect();

// Clearing database
const dropDatabase = async () => {
  await client.dropDatabase();
  console.log('Database cleared successfully.');
};

// Import data into collection
const importData = async (
  collectionName: string,
  getCollection: () => Promise<any[]>,
) => {
  const data = await getCollection();
  const collection = client.collection(collectionName);
  await collection.insertMany(data);
};

// Seed data
const seedDatabase = async () => {
  // Storage
  await importData('storage', getStorages);
  // Ingredient
  await importData('ingredient', getIngredients);

  console.log('Database seeded successfully.');
};

const main = async () => {
  const action = process.argv[2];
  switch (action) {
    case 'import':
      await seedDatabase();
      break;
    case 'clear':
      await dropDatabase();
      break;
  }
  process.exit(0);
};

main();
