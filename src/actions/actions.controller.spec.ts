import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

describe('ActionsController', () => {
  let controller: ActionsController;

  const mockActionsService: Partial<ActionsService> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [{ provide: ActionsService, useValue: mockActionsService }],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('add', () => {});
  // describe('batch', () => {});
  // describe('schedule', () => {});
});
