import {
  Component,
  ElementRef,
  HostListener,
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
import {
  HoverShowHostDirective,
  HoverShowTargetDirective,
} from '@shared/directives/hover-show';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskService } from '@app/core/services/board/task.service';
import { AutofocusDirective } from '@app/core/shared/directives/autofocus.directive';
import { requiredTrim } from '@app/core/shared/utils/validators/text.validator';
import { MatIconButtonSizeDirective } from '@app/core/shared/directives/mat-icon-button-size';
import { EditService } from '@app/core/services/board/common/edit.service';

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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HoverShowTargetDirective,
    HoverShowHostDirective,
    AutofocusDirective,
    MatIconButtonSizeDirective,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input({ required: true }) column!: Column;

  #columnService = inject(ColumnService);
  #taskService = inject(TaskService);
  #editService = inject(EditService);
  #el = inject(ElementRef);

  tasks$!: Observable<Task[]>;
  taskIds$!: Observable<string[]>;
  hasTasks$!: Observable<boolean>;

  private destroy$ = new Subject<void>();

  isEditing = false;
  isCreating = false;
  editTitle = new FormControl('', [requiredTrim(), Validators.maxLength(64)]);

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isEditing && !this.#el.nativeElement.contains(event.target)) {
      this.onBlur();
    }
  }

  dropTask(event: CdkDragDrop<string[]>) {
    this.#columnService.transferTask(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex
    );
  }

  clickAddTask() {
    this.#taskService.createTask(this.column.id);
  }

  deleteColumn() {
    this.#columnService.deleteColumn(this.column.id);
  }

  startEdit() {
    this.#columnService.startEdit(this.column.id);
    this.editTitle.setValue(this.column.title);
  }

  cancelEdit() {
    this.#columnService.cancelEdit();
  }

  saveEdit() {
    if (this.editTitle.valid) {
      const title = this.editTitle.value!.trim();
      const updatedColumn: Column = {
        ...this.column,
        title,
      };
      this.#columnService.saveEdit(updatedColumn);
    }
  }

  onBlur() {
    if (this.editTitle.valid) {
      this.saveEdit();
    } else {
      if (this.isCreating) {
        this.deleteColumn();
        return;
      }
      this.cancelEdit();
    }
  }

  ngOnInit() {
    this.tasks$ = this.#columnService.getTasksForColumn$(this.column.id);
    this.taskIds$ = this.#columnService.getTasksIdForColumn$(this.column.id);
    this.hasTasks$ = this.taskIds$.pipe(map((ids) => ids.length > 0));

    this.#columnService.editingColumnId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        if (id === this.column.id) {
          this.isEditing = true;
          return;
        }
        if (this.isEditing) {
          this.saveEdit();
          this.isEditing = false;
        }
      });

    this.#editService.isCreating$.subscribe((isCreating) => {
      this.isCreating = isCreating;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
