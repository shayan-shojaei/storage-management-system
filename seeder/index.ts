import { ObjectId } from 'mongodb';
import { connect } from './database';
import { getCollectionData } from './file';

// Connect database
const client = connect();

// Clearing database
const dropDatabase = async () => {
  await client.dropDatabase();
  console.log('Database cleared successfully.');
};

// Import data into collection
const importData = async (collectionName: string) => {
  const data = getCollectionData(collectionName).map((doc) => ({
    ...doc,
    _id: new ObjectId(doc._id),
  }));
  const collection = await client.collection(collectionName);
  return collection.insertMany(data);
};

// Seed data
const seedDatabase = async () => {
  // Storage
  await importData('storage');
  // Ingredient
  // TODO: Add ingredients seeder

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
