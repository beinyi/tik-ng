import { inject, Injectable } from '@angular/core';
import { StateService } from './state.service';
import { ColumnService } from './column.service';
import { Task } from '../../../models/index.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  #stateService = inject(StateService);
  #columnService = inject(ColumnService);

  createTask(columnId: string, task: Omit<Task, 'id' | 'status'>) {
    const id = crypto.randomUUID();
    const newTask: Task = {
      id,
      status: 'new',
      ...task,
    };

    this.#stateService.updateTask(newTask);
    this.#columnService.addTaskToColumn(columnId, id);
  }

  toggleTaskStatus(id: string) {
    const {
      currentState: { tasks },
    } = this.#stateService;
    const task = tasks[id];
    if (!task) return console.warn(`Не найдена таска ${id}`);

    const updateTask: Task = {
      ...task,
      status: task.status === 'new' ? 'done' : 'new',
    };
    this.#stateService.updateTask(updateTask);
  }

  deleteTask(taskId: string, columnId: string) {
    const {
      currentState: { tasks: prevTasks },
    } = this.#stateService;
    const { [taskId]: _, ...tasks } = prevTasks;

    this.#stateService.updateState(tasks);
    this.#columnService.removeTaskFromColumn(columnId, taskId);
  }
}
