package org.second.todo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.second.todo.enums.TodoStatus;

@Entity
@Table(name = "todos")
@Getter
@Setter
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TodoStatus status = TodoStatus.ONGOING;
    
    @Min(0)
    private int position;

    public Todo(){}

    public Todo(Long id, String name, String description, int position) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.position = position;
    }

    public Todo(String name, String description, int position) {
        this.name = name;
        this.description = description;
        this.position = position;
    }
    
    public boolean isDone(){
        return this.status == TodoStatus.DONE;
    }
}
