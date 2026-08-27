// Todo page containing:
// Search name bar
// 3 cells -> Paused | Ongoing | Finished
// Drag todo between cells.
import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoService } from '../services/todo-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoItem } from '../models/todo-model';

@Component({
  selector: 'app-todo',
  imports: [ ReactiveFormsModule ],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class TodoComponent implements OnInit{
  readonly pageSize       = 20;

  // privates
  private currentEditingTodo: TodoItem | undefined;

  private fb              = inject(FormBuilder);
  private todoService     = inject(TodoService);

  // locals
  todos                   = signal<TodoItem[]>([]);
  todoCatalog             = signal<TodoItem[]>([]);

  isTodoCatalogLoaded     = signal(false);
  isSavingTodo            = signal(false);

  // Future TODO: Frontend paging
  // Paging isn't going to be implemented for now.
  todoTotal               = signal(0);
  todoPage                = signal(0);
  todoTotalPages          = signal(0);

  todoCatalogErrorMessage = signal('');

  // FUTURE TODO: name filtering
  // Filtering isn't going to be implemented for now.
  // -------

  // name.maxLength: 50 ; description.maxLength: 100 ;
  todoCatalogForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
  });

  // methods
  ngOnInit(): void {
    /* TODO: Catalog handling
    this.loadTodoCatalog();
    */

    // Load todo list.
  }


  // Ongoing
  /*
  loadTodoCatalog(page = this.todoPage()): void {
    this.todoService.getTodoPage(page, this.pageSize).subscribe({
      next: todoPage => {
        this.todoTotal.set(todoPage.totalElements);
        this.todoPage.set(todoPage.page);
        this.todoTotalPages.set(todoPage.totalPages);
        this.todos.set(todoPage.content);
        this.todoCatalogErrorMessage.set('');
      },
      error: () => this.todoCatalogErrorMessage.set("Couldn't load todos...")
    });
  }
  */

  submit(): void {
    if(this.isSavingTodo()) {
      return;
    }

    if(this.todoCatalogForm.invalid){
      this.todoCatalogForm.markAllAsTouched();
      return;
    }

    const raw = this.todoCatalogForm.getRawValue();
    const payload = {
        done: false,
        priority: 0,
        name       : raw.name        ?? '',
        description: raw.description ?? '',
    };

    const request = this.todoService.postTodo(payload);
    this.isSavingTodo.set(true);
    request.subscribe({
        next: () => {
          // reset the forms
          this.todoCatalogForm.reset({  name: '', description: '' });
          this.isSavingTodo.set(false);
        },
        error: () => {
          this.todoCatalogErrorMessage.set("Couldn't save todo.");
          this.isSavingTodo.set(false);
        }
    })
  }

  delete(id : number): void{
    // TODO: Check removed and reorder IDs.
      this.todoService.deleteTodo(id).subscribe(({
        error: () => this.todoCatalogErrorMessage.set('Couldnt delete todo'),
      }));
  }
  // Paused

  // Finished

  // todoPageNumber(page: number):void{
  //
  // }
}
