import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { Column, Task } from '../../../../models/index.model';
import { BoardService } from '../../../../core/services/board/board.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TaskComponent } from '../task/task.component';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-column',
  imports: [
    AsyncPipe,
    CommonModule,
    MatButtonModule,
    TaskComponent,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    MatIcon,
    MatTooltipModule,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent implements OnChanges {
  @Input({ required: true }) column!: Column;
  @Output() onOpenTaskDialog = new EventEmitter<string>();
  #boardService = inject(BoardService);

  tasks$!: Observable<Task[]>;
  taskIds!: Signal<string[]>;

  readonly hasTasks = computed(() => this.taskIds().length > 0);

  dropTask(event: CdkDragDrop<string[]>) {
    if (event.previousContainer.id === event.container.id) {
      this.#boardService.moveTask(
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.#boardService.transferTask(
        event.previousContainer.id,
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  clickDelete() {
    this.#boardService.deleteColumn(this.column.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['column']?.currentValue) {
      const col = changes['column'].currentValue as Column;
      this.tasks$ = this.#boardService.getTasksForColumn$(col.id);
      this.taskIds = this.#boardService.getTasksIdForColumn(col.id);
    }
  }
}
