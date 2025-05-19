import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatSelectModule,
  MatOption,
  MatFormField,
} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BoardService } from '../../core/services/board/board.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createThemeSignal } from '../../core/signals/theme.signal';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoardCreateComponent } from './components/board-dialog/dialog-board-create.component';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { ColumnComponent } from './components/column/column.component';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { DragScrollDirective } from '../../core/shared/directives/drag-scroll.directive';
import { ColumnService } from '../../core/services/board/column.service';
import { EditService } from '@app/core/services/board/common/edit.service';

@Component({
  selector: 'app-board',
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatOption,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    ColumnComponent,
    CdkDropList,
    CdkDropListGroup,
    DragScrollDirective,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  #boardService = inject(BoardService);
  #columnService = inject(ColumnService);
  #editService = inject(EditService);
  #themeSignal = createThemeSignal();

  isDarkTheme = this.#themeSignal.isDarkTheme;
  isCreating = false;

  board$ = this.#boardService.selectedBoard$;
  boards$ = this.#boardService.boards$;
  columns$ = this.#columnService.columns$;

  columnIds$ = this.#boardService.columnIds$;
  selectedBoardId = new FormControl();

  readonly dialog = inject(MatDialog);

  dropColumn(event: CdkDragDrop<string[]>) {
    this.#boardService.moveColumn(
      this.selectedBoardId.value,
      event.previousIndex,
      event.currentIndex
    );
  }

  openBoadrDialog(): void {
    const dialogRef = this.dialog.open(DialogBoardCreateComponent);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result !== undefined) {
        this.#boardService.createBoard(result);
      }
    });
  }

  addColumn() {
    this.#columnService.createColumn();
  }

  onChangeTheme() {
    this.#themeSignal.toggleTheme();
  }

  ngOnInit() {
    this.selectedBoardId.valueChanges.subscribe((boardId) => {
      this.#boardService.selectBoard(boardId);
    });

    this.#boardService.selectedBoard$
      .pipe(
        map((board) => board?.id),
        filter((id): id is string => !!id),
        distinctUntilChanged()
      )
      .subscribe((id) => {
        this.selectedBoardId.setValue(id, { emitEvent: false });
      });

    this.#editService.isCreating$.subscribe((isCreating) => {
      this.isCreating = isCreating;
    });
  }
}
