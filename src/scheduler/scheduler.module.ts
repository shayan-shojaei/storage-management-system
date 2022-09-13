import { forwardRef, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import SchedulerRepository from './scheduler.repository';
import { MongoModule } from 'nest-mongodb';
import Job from './models/job.model';
import ActionsModule from '../actions/actions.module';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongoModule.forFeature([Job.NAME]),
    forwardRef(() => ActionsModule),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, SchedulerRepository],
  exports: [SchedulerService],
})
export class SchedulerModule {}
