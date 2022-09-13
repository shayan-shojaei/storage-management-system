import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from 'nest-mongodb';
import { SchedulerModule } from './scheduler/scheduler.module';
import ActionsModule from './actions/actions.module';
import IngredientModule from './ingredient/ingredient.module';
import StorageModule from './storage/storage.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    // Configurations
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Mongo connection
    MongoModule.forRoot(process.env.MONGO_URI, process.env.MONGO_DB),
    // Redis caching
    CacheModule.register({
      store: redisStore,
      socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
      ttl: 10,
      max: 100,
      isGlobal: true,
    }),
    StorageModule,
    IngredientModule,
    ActionsModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
