import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from 'nest-mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule.forRoot(process.env.MONGO_URI, process.env.MONGO_DB),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
