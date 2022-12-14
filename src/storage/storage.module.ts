import { forwardRef, Module } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import IngredientModule from '../ingredient/ingredient.module';
import StorageController from './storage.controller';
import Storage from './storage.model';
import StorageRepository from './storage.repository';
import StorageService from './storage.service';

@Module({
  imports: [
    MongoModule.forFeature([Storage.NAME]),
    forwardRef(() => IngredientModule),
  ],
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
  exports: [StorageRepository],
})
export default class StorageModule {}
