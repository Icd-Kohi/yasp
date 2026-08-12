package org.second.todo.service;

import org.second.todo.entities.Todo;
import org.second.todo.repository.TodoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> list(){
        Sort sort = Sort.by(Sort.Direction.ASC,"position")
                .and(Sort.by(Sort.Direction.ASC,"id"));

        return todoRepository.findAll(sort);
    }

    public List<Todo> create(Todo todo) {
        todoRepository.save(todo);
        return this.list();
    }

    public List<Todo> update(Todo todo){
        todoRepository.save(todo);
        return this.list();
    }

    public List<Todo> delete(Long id){
        todoRepository.deleteById(id);
        return this.list();
    }

}
