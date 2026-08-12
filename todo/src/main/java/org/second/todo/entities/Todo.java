package org.second.todo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

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
    private boolean done;
    private int position;

    public Todo(){}

    public Todo(Long id, String name, String description, boolean done, int position) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.done = done;
        this.position = position;
    }

    public Todo(String name, String description, boolean done, int position) {
        this.name = name;
        this.description = description;
        this.done = done;
        this.position = position;
    }

}
