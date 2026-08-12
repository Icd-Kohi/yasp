# TODO APP with:

- Spring Boot
- Spring MVC
- Spring JPA
- SpringDoc OpenAPI
- Docker compose

#### Code Practices:
- REST API
- SOLID
- DI
- Unit Testing

#### Project tree:
```
todo 
    |_src
         |_main
               |_controller
               |_service
               |_entities
               |_repository
         |_tests
```
#### API:

Check OpenAPI definition in `/swagger-ui.html`
```
GET :
        curl -X 'GET' \
          'http://127.0.0.1:8080/todos' \
          -H 'accept: */*'
Request URL: http://${address}:${port}/todos

PUT :
        curl -X 'PUT' \
          'http://${address}:${port}/todos' \
          -H 'accept: */*' \
          -H 'Content-Type: application/json' \
          -d '{
          "id": 0,
          "name": "string",
          "description": "string",
          "status": ONGOING,
          "position": 0
        }'
Request URL: http://${address}:${port}/todos
        
POST:
        curl -X 'POST' \
          'http://${address}:${port}/todos' \
          -H 'accept: */*' \
          -H 'Content-Type: application/json' \
          -d '{
          "id": 0,
          "name": "string",
          "description": "string",
          "status": "ONGOING",
          "position": 0
        }'
 Request URL: http://${address}:${port}/todos
 
 AFTER USER MOVE TODO TO "DONE" TABLE, THEN PRESSING `DELETE` BUTTON.
 DELETE: 
        curl -X 'DELETE' \
            'http://${address}:${port}/todos/{id}' \
            -H 'accept: */*'
        
 Request URL: http://127.0.0.1:8080/todos/{id}
 
 EXAMPLE VALUE:
 [
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "status": "DONE",
    "position": 0
  }
]
```

#### Usage:

In the root directory:
```sh
$ ./mvnw clean package
$ java -jar target/todo-0.0.1-SNAPSHOT.jar
```

Preferable to setup a `Dockerfile` + a `docker-compose.yml` file for the springboot app and postgresql database.
