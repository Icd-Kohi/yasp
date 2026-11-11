// Todo page containing:
// Search name bar
// 3 cells -> Paused | Ongoing | Finished
// Drag todo between cells.
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoItem, TodoStatus } from '../models/todo-model';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo',
  standalone:true,
  imports: [ CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class TodoComponent implements OnInit{
  private fb                       = inject(FormBuilder);
  protected todoService            = inject(TodoService);
searchTerm
  readonly isTodoCatalogLoaded     = signal(false);
  readonly isSavingTodo            = signal(false);
  readonly isLoading               = signal(false);
  readonly todoCatalogErrorMessage = signal('');
  readonly searchName              = signal('');

  // Future TODO: Frontend paging
  // Paging isn't going to be implemented for now.


  todoCatalogForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
  });

  readonly filteredTodos = computed(() => {
    const name = this.searchName().toLowerCase().trim();
    const items = this.todoService.items();
    if (!name) return items;

    return items.filter(
      (todo) => todo.name?.toLowerCase().includes(name) || todo.description?.toLowerCase().includes(name)
    );
  })

  readonly pausedTodos = computed(() =>
    this.filteredTodos().filter((todo) => todo.status === 'PAUSED')
  );

  readonly ongoingTodos = computed(() => {
    this.filteredTodos().filter((todo) => todo.status === 'ONGOING')
  });

  readonly doneTodos = computed(() => {
    this.filteredTodos().filter((todo) => todo.status === 'DONE')
  });


  ngOnInit(): void {
    /* TODO: Catalog handling
    this.loadTodoCatalog();
    */

    // Load list.
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading.set(true);
    this.todoService.getTodos().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.todoCatalogErrorMessage.set('');
      },
      error: (err) => {
        console.error('Error loading todos: ', err);
        this.todoCatalogErrorMessage.set('Couldn\'t connect to the backend');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    // TODO: Submit to this.todos, and call refresh todos future method.
    if (this.todoCatalogForm.invalid) {
      this.todoCatalogForm.markAllAsTouched();
      return;
    }

    if (this.isSavingTodo()) {
      return;
    }

    const raw = this.todoCatalogForm.getRawValue();
    const nextPosition = this.todoService.getTodoLen() + 1;

    const payload: Omit<TodoItem, 'id'> = {
      name: (raw.name ?? '').trim(),
      description: (raw.description ?? '').trim(),
      status: 'ONGOING',
      position: nextPosition,
    };

    this.isSavingTodo.set(true);
    this.todoCatalogErrorMessage.set('');

    this.todoService.postTodo(payload).subscribe({
      next: () => {
        this.todoCatalogForm.reset({ name: '', description: '' });
        this.isSavingTodo.set(false);
      },
      error: (err) => {
        console.error('Error saving todo:', err);
        this.todoCatalogErrorMessage.set('Could not save todo.');
        this.isSavingTodo.set(false);
      },
    });
  }

  delete(id : number): void{
    // TODO: Check removed and reorder IDs.
      this.todoService.deleteTodo(id).subscribe(({
        error: () => this.todoCatalogErrorMessage.set('Couldnt delete todo'),
      }));
  }

  updateStatus(todo: TodoItem, newStatus: TodoStatus): void{
    if(!todo.id || todo.status == newStatus) return;

    this.todoCatalogErrorMessage.set('');
    this.todoService.updateStatus(todo, newStatus).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Error updating status: ', err);
        this.todoCatalogErrorMessage.set('Couldn\'t update todo status.');
      }
    })
  }

  onDrop(event: CdkDragDrop<TodoItem[]>, targetStatus: TodoStatus): void {
    const item = event.item.data as TodoItem;
    if(!item) return;

    if(item.status !== targetStatus){
      this.updateStatus(item, targetStatus);
    }
  }

  onSearchChange(event: Event): void{
    const input = event.target as HTMLInputElement;
    this.searchName.set(input.value);
  }

  clearSearch(): void{
    this.searchTerm.set('');
  }

  dismissError(): void{
    this.todoCatalogErrorMessage.set('');
  }
}
