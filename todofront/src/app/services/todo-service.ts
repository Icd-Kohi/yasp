import { HttpClient } from '@angular/common/http';
import { Injectable , signal } from '@angular/core';
import { TodoResponse, TodoItem, TodoStatus } from '../models/todo-model';
import { environment } from '../../environments/environment';
import { Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // This is just a placeholder url.
  // If in production, append an env variable to the apiUrl.
  private apiUrl = `${environment.apiEndpoint}/todos`;

  // paging limit: 20 items
  private readonly todoPageSize = 20;

  private itemSignal  = signal<TodoItem[]>([]);
  readonly items = this.itemSignal.asReadonly();

  constructor(private http: HttpClient){};

  setTodos(todos: TodoItem[]) : void {
    this.itemSignal.set(todos);
  }

  getTodoLen() : number{
    if(!this.items){
      return 0;
    }
    return this.items().length;
  }

  getTodos() : Observable<TodoItem[]> {
      return this.http.get<TodoItem[]>(this.apiUrl)
      .pipe(tap((todos) => this.itemSignal.set(todos)));
  }

  getTodoPage(page = 0, size = this.todoPageSize) : Observable<TodoResponse<TodoItem>>{
    return this.http.get<TodoResponse<TodoItem>>(this.apiUrl, {
      params: { page, size },
    });
  }

  postTodo(data: Omit<TodoItem, 'id'>) : Observable<TodoItem[]> {
    return this.http.post<TodoItem[]>(this.apiUrl, data)
      .pipe(tap((todos) => this.itemSignal.set(todos)));
  }

  updateTodo(todo: TodoItem): Observable<TodoItem[]> {
    return this.http.put<TodoItem[]>(this.apiUrl, todo)
      .pipe(tap((todos) => this.itemSignal.set(todos)));
  }

  deleteTodo(id: number) : Observable<TodoItem[]> {
    return this.http.delete<TodoItem[]>(`${this.apiUrl}/${id}`)
      .pipe(tap((todos) => this.itemSignal.set(todos)));
  }

  updateStatus(todo: TodoItem, newStatus: TodoStatus): Observable<TodoItem[]> {
    const updated: TodoItem = {
      ...todo,
      status: newStatus,
    };
    return this.updateTodo(updated);
  }
}
