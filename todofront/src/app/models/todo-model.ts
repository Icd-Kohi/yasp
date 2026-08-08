export type TodoStatus = 'DONE' | 'ONGOING' | 'PAUSED';

// Paging data
export interface TodoResponse<T>{
  content: T[];
  page: number;
  size: number;
  totalElements: number,
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface TodoItem{
  id : number;
  name: string;
  description: string;
  done: boolean;
  priority: number;
}
