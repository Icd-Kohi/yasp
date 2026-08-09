import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoResponse, TodoItem } from '../models/todo-model';
import { catchError, forkJoin, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = "/todos";

  // paging limit: 20 items
  private readonly todoPageSize = 20;
  //
  private items? : Observable<TodoItem[]>;

  constructor(private http: HttpClient){};

  getTodos() {
    // handle paging
    // TODO: refactor this
    if(!this.items){
      this.items = this.getTodoPage(0, this.todoPageSize)
        .pipe(
            switchMap(firstPage => {
              if(firstPage.totalPages <= 1){
                return of(firstPage.content);
            }

            const remainingPage = Array.from(
                { length: firstPage.totalPages - 1 },
                (_, index) => this.getTodoPage( index + 1, this.todoPageSize)
                .pipe(
                  map(page => page.content))
              );
              return forkJoin(remainingPage)
                .pipe(
                  map(pages => [firstPage.content, ...pages].flat())
              );
          }),
          catchError(error => {
            this.invalidateTodo();
            return throwError(() => error);
          }),
          shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.items;
  }

  getTodoPage(page = 0, size = this.todoPageSize){
    return this.http.get<TodoResponse<TodoItem>>(this.apiUrl, {
      params: { page, size },
    });
  }

  postTodo(data: Omit<TodoItem, 'id'>){
    return this.http.post<TodoItem>(this.apiUrl, data)
    .pipe(tap(() => this.invalidateTodo()));
  }

  updateTodo(id: number, data: Omit<TodoItem, 'id'>){
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, data)
    .pipe(
      tap(() => this.invalidateTodo())
    );
  }

  deleteTodo(id: number){
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
    .pipe(tap(() => this.invalidateTodo())
    );
  }

  // a fallback
  private invalidateTodo(): void{
    this.items = undefined;
  }
}
