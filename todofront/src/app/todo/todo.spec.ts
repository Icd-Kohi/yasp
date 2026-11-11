import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TodoComponent } from './todo';
import { TodoService } from '../services/todo-service';
import { environment } from '../../environments/environment';

describe('Todo', () => {

  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let httpTesting: HttpTestingController;
  const apiUrl = `${environment.apiEndpoint}/todos`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    const req = httpTesting.match(apiUrl);
    if (req.length > 0) {
      req[0].flush([]);
    }
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form and add todo', () => {
    component.todoCatalogForm.setValue({
      name: 'Testing Task',
      description: 'Testing Description',
    });
    expect(component.todoCatalogForm.valid).toBe(true);

    component.submit();

    const postReq = httpTesting.expectOne(apiUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({
      name: 'Testing Task',
      description: 'Testing Description',
      status: 'ONGOING',
      position: 1,
    });
    postReq.flush([
      {
        id: 1,
        name: 'Testing Task',
        description: 'Testing Description',
        status: 'ONGOING',
        position: 1,
      },
    ]);

    expect(component.todoCatalogForm.get('name')?.value).toBe('');
    expect(component.isSavingTodo()).toBe(false);

  });
});
