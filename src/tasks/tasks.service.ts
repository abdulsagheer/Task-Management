import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //     return this.tasks;
  // }

  getTasks(
    filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     let tasks= this.getAllTasks();
  //     if(status) {
  //         tasks = tasks.filter((task) => task.status === status);
  //     }
  //     if(search) {
  //         tasks = tasks.filter((task) => {
  //             if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {
  //                 return true;
  //             }
  //             return false;
  //         });
  //     }
  //     return tasks;
  // }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  // getTaskById(id: string): Task {
  //     const found =  this.tasks.find((task) => task.id === id);
  //     if(!found) {
  //         throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }
  //     return found;
  // }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     };
  //     this.tasks.push(task);
  //     return task;
  // }
  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({id, user});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}