import { ObjectId } from 'mongodb';
import Storage from '../storage.model';

const EXAMPLE_STORAGE: Storage = {
  _id: new ObjectId('631d9d675237167ab2c1b75e'),
  name: 'Storage #1',
  ingredients: [],
  createdAt: new Date('2022-09-11T08:33:43.458Z'),
};

export const createSchema = (example: any) => ({
  type: typeof example,
  example: example,
});

export const AllStoragesExample = {
  success: true,
  count: 1,
  data: [EXAMPLE_STORAGE],
};

export const SingleStorageExample = {
  success: true,
  data: EXAMPLE_STORAGE,
};

export const DeleteStorageExample = {
  success: true,
};
