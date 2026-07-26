package org.second.todo.controller;

import jakarta.validation.Valid;
import org.second.todo.entities.Todo;
import org.second.todo.service.TodoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {
    private TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // handle CRUD requests followed by specs.
    @GetMapping
    public List<Todo> list(){
        return todoService.list();
    }

    @PostMapping
    public List<Todo> create(@Valid @RequestBody Todo todo){
        return todoService.create(todo);
    }

    @PutMapping
    public List<Todo> update(@RequestBody Todo todo){
        return todoService.update(todo);
    }

    @DeleteMapping("{id}")
    public List<Todo> delete(@PathVariable Long id){
        return todoService.delete(id);
    }
}
