import { HttpClient } from '@angular/common/http';
import { Injectable , signal } from '@angular/core';
import { TodoResponse, TodoItem } from '../models/todo-model';
import { catchError, forkJoin, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // This is just a placeholder url.
  // If in production, append an env variable to the apiUrl.
  private apiUrl = "http://localhost:8080/todos";

  // paging limit: 20 items
  private readonly todoPageSize = 20;

  private itemSignal  = signal<TodoItem[]>([]);
  readonly items = this.itemSignal.asReadonly();

  constructor(private http: HttpClient){};

  setTodos(todos: TodoItem[]) : void {
    this.itemSignal.set(todos);
  }

  getTodoLen() {
    if(!this.items){
      return 0;
    }
    return this.items.length;
  }

  getTodos() : Observable<TodoItem[]> {
      return this.http.get<TodoItem[]>(this.apiUrl)
      .pipe(
        tap((todos) => this.itemSignal.set(todos))
      );
  }

  getTodoPage(page = 0, size = this.todoPageSize) : Observable<TodoResponse<TodoItem>>{
    return this.http.get<TodoResponse<TodoItem>>(this.apiUrl, {
      params: { page, size },
    });
  }

  postTodo(data: Omit<TodoItem, 'id'>) : Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, data)
    .pipe(tap(() => this.invalidateTodo()));
  }

  updateTodo(id: number, data: Omit<TodoItem, 'id'>) : Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, data)
      .pipe(tap(() => this.invalidateTodo()));
  }

  deleteTodo(id: number) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.invalidateTodo()));
  }

  // a fallback
  private invalidateTodo(): void{
    this.items = undefined;
  }
}
