import { forwardRef, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import SchedulerRepistory from './scheduler.repository';
import { MongoModule } from 'nest-mongodb';
import Job from './models/job.model';
import ActionsModule from 'src/actions/actions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongoModule.forFeature([Job.NAME]),
    forwardRef(() => ActionsModule),
  ],
  providers: [SchedulerService, SchedulerRepistory],
  exports: [SchedulerService],
})
export class SchedulerModule {}
