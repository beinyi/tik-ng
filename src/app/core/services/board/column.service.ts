import { inject, Injectable } from '@angular/core';
import { StateService } from './state.service';
import { BoardService } from './board.service';
import { combineLatestWith, map } from 'rxjs';
import { Column } from '@models/index.model';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  #stateService = inject(StateService);
  #boardService = inject(BoardService);

  selectedBoard$ = this.#boardService.selectedBoard$;

  #state = this.#stateService.state;

  public columns$ = this.#state.pipe(
    combineLatestWith(this.selectedBoard$),
    map(([state, selectedBoard]) => {
      if (!selectedBoard) return [];
      const board = state.boards[selectedBoard.id];
      if (!board) return [];
      return (
        board.columnIds.map((id) => state.columns[id]).filter(Boolean) ?? []
      );
    })
  );

  public getTasksIdForColumn$(columnId: string) {
    return this.#state.pipe(
      map((state) => state.columns[columnId]?.taskIds ?? [])
    );
  }

  public getTasksForColumn$(columnId: string) {
    return this.#state.pipe(
      map((state) => {
        const column = state.columns[columnId];
        if (!column) return [];
        return column.taskIds.map((tid) => state.tasks[tid]).filter(Boolean);
      })
    );
  }

  #getColumns() {
    const { columns } = this.#stateService.currentState;
    return columns;
  }

  #updateColumn(column: Column) {
    this.#stateService.updateColumn(column);
  }

  createColumn() {
    const id = crypto.randomUUID();
    const newColumn: Column = {
      id,
      title: '',
      taskIds: [],
    };

    this.#updateColumn(newColumn);
    this.#boardService.addColumnToBoard(id);
  }

  addTaskToColumn(columnId: string, taskId: string) {
    const column = this.#getColumns()[columnId];
    const updateColumn: Column = {
      ...column,
      taskIds: [...column.taskIds, taskId],
    };
    this.#updateColumn(updateColumn);
  }

  moveTask(columnId: string, prevIndex: number, currIndex: number) {
    const column = this.#getColumns()[columnId];
    const updateColumn: Column = {
      ...column,
      taskIds: [...column.taskIds],
    };

    moveItemInArray(updateColumn.taskIds, prevIndex, currIndex);

    this.#updateColumn(updateColumn);
  }

  transferTask(
    prevColumnId: string,
    currColumnId: string,
    prevIndex: number,
    currIndex: number
  ) {
    if (prevColumnId === currColumnId) {
      this.moveTask(currColumnId, prevIndex, currIndex);
      return;
    }

    const columns = this.#getColumns();

    const prevColumn = columns[prevColumnId];
    const currColumn = columns[currColumnId];
    if (!prevColumn || !currColumn) return;

    const prevTasks = [...prevColumn.taskIds];
    const currTasks = [...currColumn.taskIds];

    transferArrayItem(prevTasks, currTasks, prevIndex, currIndex);

    this.#stateService.updateState({
      columns: {
        ...columns,
        [prevColumnId]: {
          ...prevColumn,
          taskIds: prevTasks,
        },
        [currColumnId]: {
          ...currColumn,
          taskIds: currTasks,
        },
      },
    });
  }

  removeTaskFromColumn(columnId: string, taskId: string) {
    const column = this.#getColumns()[columnId];
    const updatedColumn: Column = {
      ...column,
      taskIds: column.taskIds.filter((id) => id !== taskId),
    };

    this.#updateColumn(updatedColumn);
  }

  deleteColumn(columnId: string) {
    const {
      currentState: { columns, tasks },
    } = this.#stateService;

    const { [columnId]: deadColumn, ...newColumns } = columns; //или deletedColumn, но я захотел так...

    const idsToRemoved = new Set(deadColumn.taskIds);
    const newTask = Object.fromEntries(
      Object.entries(tasks).filter(([id]) => !idsToRemoved.has(id))
    );

    this.#stateService.updateState({
      columns: newColumns,
      tasks: newTask,
    });
    this.#boardService.removeColumnFromBoard(columnId);
  }
}
