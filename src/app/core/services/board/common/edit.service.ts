import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

type EditingType = 'edit' | 'create';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  #currentId: string | null = null;
  #currentType: EditingType | null = null;
  #editingId$ = new BehaviorSubject<string | null>(null);
  #editingType$ = new BehaviorSubject<EditingType | null>(null);

  readonly isCreating$ = this.getEditingType().pipe(
    map((type) => type === 'create')
  );

  setEditing(id: string, type: EditingType | undefined = 'edit') {
    this.#currentType = type;
    this.#currentId = id;
    this.#editingId$.next(id);
    this.#editingType$.next(type);
  }

  getEditingId() {
    return this.#editingId$.asObservable();
  }
  getEditingType() {
    return this.#editingType$.asObservable();
  }

  stopEditing() {
    this.#currentId = null;
    this.#editingId$.next(null);
    this.#editingType$.next(null);
  }

  get currentEditingId() {
    return this.#currentId;
  }

  get currentEditingType() {
    return this.#currentType;
  }
}
