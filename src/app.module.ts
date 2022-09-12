import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from 'nest-mongodb';
import { SchedulerModule } from './scheduler/scheduler.module';
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
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
