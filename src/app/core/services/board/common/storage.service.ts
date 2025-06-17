import { Injectable } from '@angular/core';
import { Board, BoardState, Column, Task } from '@models/index.model';
import { openDB, DBSchema } from 'idb';

interface KanbanDB extends DBSchema {
  boards: { key: string; value: Board };
  columns: { key: string; value: Column };
  tasks: { key: string; value: Task };
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private dbPromise = openDB<KanbanDB>('kanban-db', 1, {
    upgrade(db) {
      db.createObjectStore('boards', { keyPath: 'id' });
      db.createObjectStore('columns', { keyPath: 'id' });
      db.createObjectStore('tasks', { keyPath: 'id' });
    },
  });

  async updateStorage(partialState: Partial<BoardState>) {
    const db = await this.dbPromise;

    if (partialState.boards) {
      for (const [_, board] of Object.entries(partialState.boards)) {
        await db.put('boards', board);
      }
    }

    if (partialState.columns) {
      for (const [_, column] of Object.entries(partialState.columns)) {
        await db.put('columns', column);
      }
    }

    if (partialState.tasks) {
      for (const [_, task] of Object.entries(partialState.tasks)) {
        await db.put('tasks', task);
      }
    }
  }

  async saveBoard(board: Board) {
    const db = await this.dbPromise;
    await db.put('boards', board);
  }

  async saveColumn(column: Column) {
    const db = await this.dbPromise;
    await db.put('columns', column);
  }

  async saveTask(task: Task) {
    const db = await this.dbPromise;
    await db.put('tasks', task);
  }

  async deleteTask(id: string) {
    const db = await this.dbPromise;
    await db.delete('tasks', id);
  }

  async deleteColumn(id: string) {
    const db = await this.dbPromise;
    await db.delete('columns', id);
  }

  async deleteBoard(id: string) {
    const db = await this.dbPromise;
    await db.delete('boards', id);
  }

  async getAllData(): Promise<{
    boards: Board[];
    columns: Column[];
    tasks: Task[];
  }> {
    const db = await this.dbPromise;
    return {
      boards: await db.getAll('boards'),
      columns: await db.getAll('columns'),
      tasks: await db.getAll('tasks'),
    };
  }
}
