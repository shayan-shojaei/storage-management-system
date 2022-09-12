import { forwardRef, Module } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import { SchedulerModule } from '../scheduler/scheduler.module';
import Ingredient from '../ingredient/ingredient.model';
import Storage from '../storage/storage.model';
import { ActionsController } from './actions.controller';
import ActionsRepository from './actions.repository';
import { ActionsService } from './actions.service';

@Module({
  imports: [
    MongoModule.forFeature([Storage.NAME, Ingredient.NAME]),
    forwardRef(() => SchedulerModule),
  ],
  controllers: [ActionsController],
  providers: [ActionsService, ActionsRepository],
  exports: [ActionsService],
})
export default class ActionsModule {}
