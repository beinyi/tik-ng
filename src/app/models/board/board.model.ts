export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}

export type TaskStatus = 'new' | 'done';

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

export interface BoardState {
  boards: { [id: string]: Board };
  columns: { [id: string]: Column };
  tasks: { [id: string]: Task };
}
