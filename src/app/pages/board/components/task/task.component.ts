import { Component, inject, Input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../models/index.model';
import { MatIcon } from '@angular/material/icon';
import { TaskService } from '../../../../core/services/board/task.service';

@Component({
  selector: 'app-task',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatCardSubtitle,
    MatButtonModule,
    MatIcon,
    MatStepperModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() columnId!: string;

  #taskService = inject(TaskService);

  get isDone(): boolean {
    return this.task.status === 'done';
  }

  clickToggleStatus() {
    this.#taskService.toggleTaskStatus(this.task.id);
  }

  clickDelete() {
    this.#taskService.deleteTask(this.task.id, this.columnId);
  }
}
