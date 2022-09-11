import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { InjectCollection } from 'nest-mongodb';
import Storage from './storage.model';

@Injectable()
export default class StorageService {
  constructor(
    @InjectCollection(Storage.NAME)
    private readonly storages: Collection<Storage>,
  ) {}
}
