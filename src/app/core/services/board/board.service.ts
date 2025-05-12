import { computed, inject, Injectable } from '@angular/core';
import { Board } from '../../../models/index.model';
import { BehaviorSubject, map } from 'rxjs';
import { demoBoardId } from './state.mock';
import { StateService } from './state.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  #stateService = inject(StateService);

  #state = this.#stateService.state;
  #selectedBord = new BehaviorSubject<string>(demoBoardId);

  public boards$ = this.#state.pipe(
    map((state) => Object.values(state.boards))
  );
  public selectedBoard$ = this.#selectedBord.pipe(
    map((id) => (id ? this.#stateService.currentState.boards[id] : null))
  );

  get selectedBoardId() {
    return this.#selectedBord.value;
  }
  get selectedBoard() {
    if (!this.selectedBoardId) return null;
    const { boards } = this.#stateService.currentState;
    return boards[this.selectedBoardId];
  }

  readonly columnIds = computed(() => {
    const boardId = this.selectedBoardId;
    if (!boardId) return [];
    const { boards } = this.#stateService.currentState;
    return boards[boardId]?.columnIds ?? [];
  });

  selectBoard(id: string) {
    this.#selectedBord.next(id);
  }

  createBoard(title: string) {
    const id = crypto.randomUUID();
    const newBoard: Board = {
      id,
      title,
      columnIds: [],
    };

    this.#stateService.updateBoard(newBoard);
    this.selectBoard(id);
  }

  addColumnToBoard(columnId: string) {
    const {
      currentState: { boards },
    } = this.#stateService;
    const board = boards[this.selectedBoardId];
    const updateBoard = {
      ...board,
      columnIds: [...board.columnIds, columnId],
    };

    this.#stateService.updateBoard(updateBoard);
  }

  moveColumn(boardId: string, prevIndex: number, currIndex: number) {
    const {
      currentState: { boards },
    } = this.#stateService;

    const board = boards[boardId];
    if (!board) return;
    const updateBoard: Board = {
      ...board,
      columnIds: [...board.columnIds],
    };

    moveItemInArray(updateBoard.columnIds, prevIndex, currIndex);

    this.#stateService.updateBoard(updateBoard);
  }

  removeColumnFromBoard(columnId: string) {
    const {
      currentState: { boards },
    } = this.#stateService;

    const board = boards[this.selectedBoardId];
    const updatedBoard: Board = {
      ...board,
      columnIds: board.columnIds.filter((id) => id !== columnId),
    };
    this.#stateService.updateBoard(updatedBoard);
  }
}
