import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from 'nest-mongodb';
import ActionsModule from './actions/actions.module';
import IngredientModule from './ingredient/ingredient.module';
import StorageModule from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule.forRoot(process.env.MONGO_URI, process.env.MONGO_DB),
    StorageModule,
    IngredientModule,
    ActionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
