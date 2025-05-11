import { Component, HostListener, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  readonly title = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ]);
  readonly description = new FormControl('', [Validators.maxLength(255)]);

  @HostListener('window:keydown.Enter', ['$event'])
  onDialogClick() {
    if (this.title.valid) {
      this.dialogRef.close({
        title: this.title.value,
        description: this.description.value,
      });
    } else {
      this.title.setErrors({ invalid: true }, { emitEvent: true });
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
