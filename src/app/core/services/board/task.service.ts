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

  createTask(columnId: string) {
    const id = crypto.randomUUID();
    const newTask: Task = {
      id,
      status: 'new',
      title: '',
      description: '',
    };

    this.#stateService.updateTask(newTask);
    this.#columnService.addTaskToColumn(columnId, id);
  }

  #updateTask(task: Task) {
    this.#stateService.updateTask(task);
  }

  isTaskId(id: string) {
    const tasks = this.#getTasks();
    return Boolean(tasks[id]);
  }

  #getTasks() {
    const {
      currentState: { tasks },
    } = this.#stateService;
    return tasks;
  }

  toggleTaskStatus(id: string) {
    const tasks = this.#getTasks();
    const task = tasks[id];
    if (!task) return console.warn(`Не найдена таска ${id}`);

    const updateTask: Task = {
      ...task,
      status: task.status === 'new' ? 'done' : 'new',
    };
    this.#stateService.updateTask(updateTask);
  }

  deleteTask(taskId: string, columnId: string) {
    const prevTasks = this.#getTasks();
    const { [taskId]: _, ...tasks } = prevTasks;

    this.#stateService.updateState(tasks);
    this.#columnService.removeTaskFromColumn(columnId, taskId);
  }
}
