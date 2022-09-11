import { Module } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import StorageController from './storage.controller';
import Storage from './storage.model';
import StorageService from './storage.service';

@Module({
  imports: [MongoModule.forFeature([Storage.NAME])],
  controllers: [StorageController],
  providers: [StorageService],
})
export default class StorageModule {}
