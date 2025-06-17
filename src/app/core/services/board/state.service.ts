import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board, BoardState, Column, Task } from '@models/index.model';
import { initialState } from './state.mock';
import { StorageService } from './common/storage.service';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  #storageService = inject(StorageService);

  readonly isReady$ = new BehaviorSubject(false);
  readonly state$ = new BehaviorSubject<BoardState>({
    boards: {},
    tasks: {},
    columns: {},
  });
  constructor(private storage: StorageService) {
    this.#loadPersistedState();
  }

  async #loadPersistedState() {
    const { boards, columns, tasks } = await this.storage.getAllData();

    if (!boards.length) {
      this.state$.next(structuredClone(initialState));
      this.isReady$.next(true);
      return;
    }

    const boardMap = Object.fromEntries(boards.map((b) => [b.id, b]));
    const columnMap = Object.fromEntries(columns.map((c) => [c.id, c]));
    const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]));

    this.state$.next({
      boards: boardMap,
      columns: columnMap,
      tasks: taskMap,
    });

    this.isReady$.next(true);
  }

  get currentState() {
    return this.state$.value;
  }

  #updateState(newState: Partial<BoardState>) {
    this.state$.next({
      ...this.currentState,
      ...newState,
    });
  }

  updateTask(task: Task) {
    const { tasks } = this.currentState;
    this.#updateState({
      tasks: { ...tasks, [task.id]: task },
    });
    this.#storageService.saveTask(task);
  }

  updateColumn(column: Column) {
    const { columns } = this.currentState;
    this.#updateState({
      columns: { ...columns, [column.id]: column },
    });
    this.#storageService.saveColumn(column);
  }

  updateBoard(board: Board) {
    const { boards } = this.currentState;
    this.#updateState({
      boards: { ...boards, [board.id]: board },
    });
    this.#storageService.saveBoard(board);
  }

  deleteColumn(id: string) {
    const { columns, tasks } = this.currentState;

    const { [id]: deadColumn, ...newColumns } = columns;

    const idsToRemoved = new Set(deadColumn.taskIds);
    const newTask = Object.fromEntries(
      Object.entries(tasks).filter(([id]) => !idsToRemoved.has(id))
    );

    this.#updateState({
      columns: newColumns,
      tasks: newTask,
    });
    this.#storageService.deleteColumn(id);
  }

  deleteTask(id: string) {
    const { tasks } = this.currentState;
    const { [id]: _, ...newTasks } = tasks;

    this.#updateState({ tasks: newTasks });
    this.#storageService.deleteTask(id);
  }
}
