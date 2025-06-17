import { inject, Injectable } from '@angular/core';
import { Board } from '@models/index.model';
import { BehaviorSubject, filter, map, take } from 'rxjs';
import { demoBoardId } from './state.mock';
import { StateService } from './state.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

const SELECTED_BOARD_KEY = 'selectedBoardId';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  #stateService = inject(StateService);

  #state = this.#stateService.state$;
  #selectedBoard = new BehaviorSubject<string>(demoBoardId);
  constructor() {
    this.#stateService.isReady$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.#initSelectedBoard());
  }

  #initSelectedBoard() {
    const savedId = localStorage.getItem(SELECTED_BOARD_KEY);
    const boards = this.#stateService.currentState.boards;
    console.log(savedId);

    if (savedId && boards[savedId]) {
      this.#selectedBoard.next(savedId);
    } else {
      const firstBoardId = Object.keys(boards)[0];
      if (firstBoardId) {
        this.selectBoard(firstBoardId);
      }
    }
  }

  public boards$ = this.#state.pipe(
    map((state) => Object.values(state.boards))
  );
  public selectedBoard$ = this.#selectedBoard.pipe(
    map((id) => (id ? this.#stateService.currentState.boards[id] : null))
  );

  readonly columnIds$ = this.#state.pipe(
    map((state) => state.boards[this.selectedBoardId]?.columnIds ?? [])
  );

  get selectedBoardId() {
    return this.#selectedBoard.value;
  }
  get selectedBoard() {
    const id = this.#selectedBoard.value;
    return id ? this.#stateService.currentState.boards[id] : null;
  }

  selectBoard(id: string) {
    this.#selectedBoard.next(id);
    localStorage.setItem(SELECTED_BOARD_KEY, id);
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
