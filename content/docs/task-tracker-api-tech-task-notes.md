**REST APIs/ Good API Design - Good API naming conventions, Request/ Response headers, Query/Path params**
REST APIs:
- CRUD —> Resources (via URIs)
- Request - Response
**Naming Conventions**:
- Use clear and consistent names for endpoints.
- Use nouns for resource names (users, fruits, books)
- Use plural nouns for resource names (tasks).
- Use HTTP methods correctly (GET for retrieval, POST for creation, PUT for update, DELETE for deletion).
- Endpoints like GET /tasks/{id} and POST /tasks are intuitive and self-explanatory.
**Request/Response Headers**:
- Use standard headers for content type and authorisation.
- Use Content-Type: application/json for all request and response bodies.
- Use Authorisation: Bearer {token} for securing endpoints.
**Query/Path Parameters**:
- Use **path parameters** to identify specific resources (/tasks/{id}).
- Use **query parameters** for filtering tasks (/tasks?category={categoryId}&completed={true/false}).
**Task APIs**:
- GET /tasks: Retrieve all tasks.
- GET /tasks/{id}: Retrieve a specific task by ID.
- POST /tasks: Create a new task.
- PUT /tasks/{id}: Update an existing task by ID.
- DELETE /tasks/{id}: Delete a task by ID.
**—**
**JSON payloads**
{
"title": "Learn REST",
"description": "https://restfulapi.net",
"dueDate": "2024-06-27",
"categoryId": 1,
"completed": false
}
{
"title": "Learn React",
"description": "https://react.dev",
"dueDate": "2024-06-30",
"categoryId": 2,
"completed": true
}
{
"title": "Learn SpringBoot",
"description": "https://roadmap.sh/spring-boot",
"dueDate": "2024-06-24",
"categoryId": 3,
"completed": false
}