import { User } from "src/auth/user.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTaskFilterDto } from "./dtos/get-task-filter.dto";
import { Task } from "./task.entity";
export declare class TasksRepository extends Repository<Task> {
    private logger;
    getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]>;
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
}
