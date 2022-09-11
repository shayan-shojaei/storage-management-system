import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import Storage from '../storage/storage.model';

@Injectable()
export default class IngredientService {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storage: Collection<Storage>,
  ) {}
}
