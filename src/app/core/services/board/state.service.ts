import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board, BoardState, Column, Task } from '../../../models/index.model';
import { initialState } from './state.mock';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  readonly state = new BehaviorSubject<BoardState>(
    structuredClone(initialState)
  );
  get currentState() {
    return this.state.value;
  }

  updateState(newState: Partial<BoardState>) {
    this.state.next({
      ...this.currentState,
      ...newState,
    });
  }

  updateTask(task: Task) {
    const { tasks } = this.currentState;
    this.updateState({
      tasks: { ...tasks, [task.id]: task },
    });
  }

  updateColumn(column: Column) {
    const { columns } = this.currentState;
    this.updateState({
      columns: { ...columns, [column.id]: column },
    });
  }

  updateBoard(board: Board) {
    const { boards } = this.currentState;
    this.updateState({
      boards: { ...boards, [board.id]: board },
    });
  }
}
