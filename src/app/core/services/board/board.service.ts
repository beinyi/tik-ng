import { computed, Injectable } from '@angular/core';
import {
  Board,
  BoardState,
  Column,
  Task,
  TaskStatus,
} from '../../../models/index.model';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  map,
  Observable,
} from 'rxjs';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { initialState } from './state.mock';

//TODO: разнести на разные сервисы

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  #demoBoardId = Object.entries(initialState.boards)[0][0];

  #state = new BehaviorSubject<BoardState>(structuredClone(initialState));
  #selectedBord = new BehaviorSubject<string | null>(this.#demoBoardId);

  public boards$ = this.#state.pipe(
    map((state) => Object.values(state.boards))
  );
  public selectedBoard$ = this.#selectedBord.pipe(
    map((id) => (id ? this.currentState.boards[id] : null))
  );

  public columns$ = this.#state.pipe(
    combineLatestWith(this.#selectedBord),
    map(([state, selectedId]) => {
      if (!selectedId) return [];
      const board = state.boards[selectedId];
      if (!board) return [];
      return (
        board.columnIds.map((id) => state.columns[id]).filter(Boolean) ?? []
      );
    })
  );

  readonly columnIds = computed(() => {
    const boardId = this.selectedBoardId;
    if (!boardId) return [];
    return this.currentState.boards[boardId]?.columnIds ?? [];
  });

  public tasksForColumns$ = this.columns$.pipe(
    combineLatestWith(this.#state.pipe(map((s) => s.tasks))),
    map(([columns, tasksMap]) =>
      columns.map((col) => ({
        columnId: col.id,
        tasks: col.taskIds.map((tid) => tasksMap[tid]).filter(Boolean) ?? [],
      }))
    )
  );

  readonly getTasksIdForColumn = (columnId: string) =>
    computed(() => {
      if (!columnId) return [];
      return this.currentState.columns[columnId]?.taskIds ?? [];
    });

  public getTasksForColumn$(columnId: string): Observable<Task[]> {
    return this.#state.pipe(
      map((state) => {
        const column = state.columns[columnId];
        if (!column) return [];
        return column.taskIds.map((tid) => state.tasks[tid]).filter(Boolean);
      })
    );
  }

  get currentState() {
    return this.#state.value;
  }
  get selectedBoardId() {
    return this.#selectedBord.value;
  }
  get selectedBoard() {
    if (!this.selectedBoardId) return null;
    return this.currentState.boards[this.selectedBoardId];
  }

  #updateState(newState: Partial<BoardState>) {
    this.#state.next({
      ...this.currentState,
      ...newState,
    });
  }

  selectBoard(id: string | null) {
    this.#selectedBord.next(id);
  }

  createBoard(title: string) {
    const id = crypto.randomUUID();
    const newBoard: Board = {
      id,
      title,
      columnIds: [],
    };
    const { boards } = this.currentState;

    this.#updateState({
      boards: { ...boards, [id]: newBoard },
    });
    this.selectBoard(id);
  }

  addColumn(title: string) {
    const id = crypto.randomUUID();
    const newColumn: Column = {
      id,
      title,
      taskIds: [],
    };

    const { boards, columns } = this.currentState;
    const board = boards[this.selectedBoardId!];
    const updateBoard = {
      ...board,
      columnIds: [...board.columnIds, id],
    };
    this.#updateState({
      columns: {
        ...columns,
        [id]: newColumn,
      },
      boards: {
        ...boards,
        [this.selectedBoardId!]: updateBoard,
      },
    });
  }

  addTask(columnId: string, task: Omit<Task, 'id' | 'status'>) {
    const id = crypto.randomUUID();
    const newTask: Task = {
      id,
      status: 'new',
      ...task,
    };

    const { columns, tasks } = this.currentState;
    const column = columns[columnId];
    const updateColumn: Column = {
      ...column,
      taskIds: [...column.taskIds, id],
    };
    this.#updateState({
      columns: {
        ...columns,
        [columnId]: updateColumn,
      },
      tasks: {
        ...tasks,
        [id]: newTask,
      },
    });
  }

  moveColumn(boardId: string, prevIndex: number, currIndex: number) {
    const state = structuredClone(this.#state.getValue());

    const board = state.boards[boardId];
    if (!board) return;

    moveItemInArray(board.columnIds, prevIndex, currIndex);

    this.#state.next(state);
  }

  moveTask(columnId: string, prevIndex: number, currIndex: number) {
    const state = structuredClone(this.#state.getValue());

    const column = state.columns[columnId];
    if (!column) return;

    moveItemInArray(column.taskIds, prevIndex, currIndex);

    this.#state.next(state);
  }

  transferTask(
    prevColumnId: string,
    currColumnId: string,
    prevIndex: number,
    currIndex: number
  ) {
    const state = structuredClone(this.#state.getValue());

    const prevColumn = state.columns[prevColumnId];
    const currColumn = state.columns[currColumnId];
    if (!prevColumn || !currColumn) return;

    transferArrayItem(
      prevColumn.taskIds,
      currColumn.taskIds,
      prevIndex,
      currIndex
    );

    this.#state.next(state);
  }

  deleteColumn(columnId: string) {
    if (!this.selectedBoardId) return console.warn('Не выбрана доска');
    const { columns, boards, tasks } = this.currentState;
    const { [columnId]: deadColumn, ...newColumns } = columns; //или deletedColumn, но я захотел так...

    const board = boards[this.selectedBoardId!];
    const updatedBoard: Board = {
      ...board,
      columnIds: board.columnIds.filter((id) => id !== columnId),
    };

    const idsToRemoved = new Set(deadColumn.taskIds);
    const newTask = Object.fromEntries(
      Object.entries(tasks).filter(([id]) => !idsToRemoved.has(id))
    );

    this.#updateState({
      columns: newColumns,
      boards: {
        ...boards,
        [board.id]: updatedBoard,
      },
      tasks: newTask,
    });
  }

  toggleTaskStatus(id: string) {
    const { tasks } = this.currentState;
    const task = tasks[id];
    if (!task) return console.warn(`Не найдена таска ${id}`);
    const updateStatus: TaskStatus = task.status === 'new' ? 'done' : 'new';
    const updateTask: Task = {
      ...task,
      status: updateStatus,
    };
    this.#updateState({
      tasks: {
        ...tasks,
        [id]: updateTask,
      },
    });
  }

  deleteTask(taskId: string, columnId: string) {
    const { tasks, columns } = this.currentState;
    const { [taskId]: _, ...newTasks } = tasks;
    const column = columns[columnId];
    const updatedColumn: Column = {
      ...column,
      taskIds: column.taskIds.filter((id) => id !== taskId),
    };

    this.#updateState({
      tasks: newTasks,
      columns: {
        ...columns,
        [columnId]: updatedColumn,
      },
    });
  }
}
