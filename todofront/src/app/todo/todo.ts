// Todo page containing:
// Search name bar
// 3 cells -> Paused | Ongoing | Finished
// Drag todo between cells.
import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoService } from '../services/todo-service';
import { FormBuilder, Validators } from '@angular/forms';
import { TodoItem } from '../models/todo-model';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class TodoComponent implements OnInit{
  // readonly
  readonly pageSize = 20;

  // privates
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private currentEditingTodo: TodoItem | undefined;

  // locals
  todos = signal<TodoItem[]>([]);
  todoCatalog = signal<TodoItem[]>([]);

  isTodoCatalogLoaded = signal(false);

  todoTotal = signal(0);
  todoPage = signal(0);
  todoTotalPages = signal(0);

  todoCatalogErrorMessage =signal('');

  // TODO: future filter
  // -------

  // name.maxLength: 50 ; description.maxLength: 100 ;
  todoCatalogForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
  });

  // methods
  ngOnInit(): void {
    this.loadTodoCatalog();
  }


  // Ongoing

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

  // Paused

  // Finished

  // TODO: Frontend paging
}
