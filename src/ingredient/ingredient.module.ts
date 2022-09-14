import { forwardRef, Module } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import StorageModule from '../storage/storage.module';
import IngredientController from './ingredient.controller';
import Ingredient from './ingredient.model';
import IngredientRepository from './ingredient.repository';
import IngredientService from './ingredient.service';

@Module({
  imports: [
    MongoModule.forFeature([Ingredient.NAME]),
    forwardRef(() => StorageModule),
  ],
  controllers: [IngredientController],
  providers: [IngredientService, IngredientRepository],
  exports: [IngredientRepository],
})
export default class IngredientModule {}
