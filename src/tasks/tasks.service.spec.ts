import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';

const MockGetTasks = jest.fn();
const MockFindOne = jest.fn();

const mockTasksRepository = () => ({
  getTasks: MockGetTasks,
  findOne: MockFindOne,
});

const mockUser = {
  username: 'Root',
  id: 'Me',
  password: 'Supersafe',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  beforeEach(async () => {
    // initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      //   mockTasksRepository.getTasks.mockReturnValue('someValue');
      MockGetTasks.mockReturnValue('someValue');
      // call tasksService.getTasks, which should then call the repository's getTasks
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };
      MockFindOne.mockReturnValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', async () => {
      MockFindOne.mockResolvedValue(null);

      await expect(
        tasksService.getTaskById('someId', mockUser),
      ).rejects.toThrow('Task with ID "someId" not found');
    });
  });
});
