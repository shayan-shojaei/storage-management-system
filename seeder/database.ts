import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();
export const connect = () => {
  const client = new MongoClient(process.env.MONGO_URI);
  return client.db(process.env.MONGO_DB);
};
