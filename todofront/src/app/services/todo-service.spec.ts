import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from './todo-service';
import { TodoItem } from '../models/todo-model';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpTesting: HttpTestingController;
  const apiUrl = `${environment.apiEndpoint}/todos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TodoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos and update items signal', () => {
    const mockTodos: TodoItem[] = [
      { id: 1, name: 'todo 1', description: 'Desc 1', status: 'ONGOING', position: 1 },
      { id: 2, name: 'todo 2', description: 'Desc 2', status: 'DONE', position: 2 },
    ];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
      expect(service.items()).toEqual(mockTodos);
      expect(service.getTodoLen()).toBe(2);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should post new todo and update items signal', () => {
    const newTodo: Omit<TodoItem, 'id'> = {
      name: 'New Todo',
      description: 'New Desc',
      status: 'ONGOING',
      position: 1,
    };
    const updatedList: TodoItem[] = [
      { id: 1, ...newTodo },
    ];

    service.postTodo(newTodo).subscribe((todos) => {
      expect(todos).toEqual(updatedList);
      expect(service.items()).toEqual(updatedList);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(updatedList);
  });

  it('should update todo and update items signal', () => {
    const toUpdate: TodoItem = {
      id: 1,
      name: 'todo 1 Updated',
      description: 'Desc 1',
      status: 'DONE',
      position: 1,
    };
    const updatedList: TodoItem[] = [toUpdate];

    service.updateTodo(toUpdate).subscribe((todos) => {
      expect(todos).toEqual(updatedList);
      expect(service.items()).toEqual(updatedList);
    });

    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(toUpdate);
    req.flush(updatedList);
  });

  it('should delete todo and update items signal', () => {
    const remainingList: TodoItem[] = [];

    service.deleteTodo(1).subscribe((todos) => {
      expect(todos).toEqual(remainingList);
      expect(service.items()).toEqual(remainingList);
    });

    const req = httpTesting.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(remainingList);
});
