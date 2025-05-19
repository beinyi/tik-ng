import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '@models/index.model';
import { MatIcon } from '@angular/material/icon';
import { TaskService } from '@services/board/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconButtonSizeDirective } from '@directives/mat-icon-button-size';
import {
  HoverShowTargetDirective,
  HoverShowHostDirective,
} from '@directives/hover-show';
import { AutofocusDirective } from '@app/core/shared/directives/autofocus.directive';
import { Subject, takeUntil } from 'rxjs';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { EditService } from '@app/core/services/board/common/edit.service';

@Component({
  selector: 'app-task',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    CdkDrag,
    FormsModule,
    CommonModule,
    MatIconButtonSizeDirective,
    HoverShowTargetDirective,
    HoverShowHostDirective,
    AutofocusDirective,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  @Input() columnId!: string;

  #taskService = inject(TaskService);
  #editService = inject(EditService);
  #el = inject(ElementRef);

  private destroy$ = new Subject<void>();

  isCreating = false;
  isEditing = false;
  editTitle = '';
  editDescription = '';

  get isDone() {
    return this.task.status === 'done';
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isEditing && !this.#el.nativeElement.contains(event.target)) {
      this.onBlur();
    }
  }

  startEdit() {
    this.editTitle = this.task.title;
    this.editDescription = this.task.description || '';
    this.#taskService.startEdit(this.task.id);
  }

  cancelEdit() {
    this.#taskService.cancelEdit();
  }

  saveEdit() {
    const title = this.editTitle.trim();
    if (title) {
      const updatedTask: Task = {
        ...this.task,
        title,
      };
      this.#taskService.saveEdit(updatedTask);
    } else this.cancelEdit();
  }

  clickToggleStatus() {
    this.#taskService.toggleTaskStatus(this.task.id);
  }

  deleteTask() {
    this.#taskService.deleteTask(this.task.id, this.columnId);
  }

  onBlur() {
    const title = this.editTitle.trim();
    if (this.isCreating && !title) {
      this.cancelEdit();
      this.deleteTask();
    } else this.saveEdit();
  }

  ngOnInit() {
    this.#taskService.editingTaskId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        if (id === this.task.id) {
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
