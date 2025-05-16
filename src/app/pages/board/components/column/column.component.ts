import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { Column, Task } from '@models/index.model';
import { map, Observable, Subject, takeUntil } from 'rxjs';
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
import { ColumnService } from '@services/board/column.service';

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
  #columnService = inject(ColumnService);

  tasks$!: Observable<Task[]>;
  taskIds$!: Observable<string[]>;
  hasTasks$!: Observable<boolean>;

  dropTask(event: CdkDragDrop<string[]>) {
    this.#columnService.transferTask(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex
    );
  }

  clickDelete() {
    this.#columnService.deleteColumn(this.column.id);
  }

  ngOnInit() {
    this.tasks$ = this.#columnService.getTasksForColumn$(this.column.id);
    this.taskIds$ = this.#columnService.getTasksIdForColumn$(this.column.id);
    this.hasTasks$ = this.taskIds$.pipe(map((ids) => ids.length > 0));
  }
  }
}
