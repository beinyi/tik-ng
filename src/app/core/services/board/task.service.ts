import { inject, Injectable } from '@angular/core';
import { StateService } from './state.service';
import { ColumnService } from './column.service';
import { Task } from '../../../models/index.model';
import { EditService } from './common/edit.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  #stateService = inject(StateService);
  #columnService = inject(ColumnService);
  #editService = inject(EditService);

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
    this.#editService.setEditing(id, 'create');
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

    const currentEditingId = this.#editService.currentEditingId;
    if (currentEditingId === taskId) {
      this.#editService.stopEditing();
    }

    this.#stateService.updateState(tasks);
    this.#columnService.removeTaskFromColumn(columnId, taskId);
  }

  //EDITING

  readonly isCreating$ = this.#editService
    .getEditingType()
    .pipe(map((type) => type === 'create'));

  readonly editingTaskId$ = this.#editService
    .getEditingId()
    .pipe(map((id) => (id === null || this.isTaskId(id) ? id : null)));

  startEdit(id: string) {
    this.#editService.setEditing(id);
  }

  cancelEdit() {
    const currentId = this.#editService.currentEditingId;
    if (!currentId || !this.isTaskId(currentId)) return;
    const task = this.#getTasks()[currentId];

    this.#updateTask(task);
    this.#editService.stopEditing();
  }

  saveEdit(updateTask: Task) {
    const { currentEditingId } = this.#editService;

    this.#updateTask(updateTask);
    if (updateTask.id === currentEditingId) {
      this.#editService.stopEditing();
    }
  }
}
