import { Module } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import IngredientController from './ingredient.controller';
import Ingredient from './ingredient.model';
import IngredientService from './ingredient.service';

@Module({
  imports: [MongoModule.forFeature([Ingredient.NAME])],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export default class IngredientModule {}
