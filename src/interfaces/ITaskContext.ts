import { ITask } from './ITask';

export interface ITaskContext {
  tasks: ITask[];
  loading: boolean;
  addTask: (task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}
