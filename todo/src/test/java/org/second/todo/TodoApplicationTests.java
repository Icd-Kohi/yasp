package org.second.todo;

import org.junit.jupiter.api.Test;
import org.second.todo.entities.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.webtestclient.autoconfigure.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class TodoApplicationTests {
    @Autowired
    private WebTestClient webTestClient;
    @Test
    void TodoAppTestPass() {
        var todo = new Todo("test 1", "test description 1", false,  1);

        webTestClient
                .post()
                .uri("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(todo)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .consumeWith(System.out::println)
                .jsonPath("$").isArray()
                .jsonPath("$.length()").isEqualTo(1)
                .jsonPath("$[0].name").isEqualTo(todo.getName())
                .jsonPath("$[0].description").isEqualTo(todo.getDescription())
                .jsonPath("$[0].done").isEqualTo(todo.isDone())
                .jsonPath("$[0].priority").isEqualTo(todo.getPriority());
    }

    @Test
    void TodoAppTestFail() {
        webTestClient
                .post()
                .uri("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(new Todo("", "", false, 0))
                .exchange()
                // collect then expect bad request
                .expectStatus().isBadRequest();
    }

    @Test
    void TodoAppTestFail2() {
        // TODO more test cases
    }

}
