import { Component, HostListener, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-board-create',
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
  templateUrl: './dialog-board-create.component.html',
  styleUrl: './dialog-board-create.component.scss',
})
export class DialogBoardCreateComponent {
  readonly dialogRef = inject(MatDialogRef<DialogBoardCreateComponent>);
  readonly name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ]);

  @HostListener('window:keydown.Enter', ['$event'])
  onDialogClick() {
    if (this.name.valid) {
      this.dialogRef.close(this.name.value);
    } else {
      this.name.setErrors({ invalid: true }, { emitEvent: true });
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
