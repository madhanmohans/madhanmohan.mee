## Frontend
- package-lock.json
- Idempotency → same effect, when run n times
- Create Open API Spec → discuss with the team → create models

> [!info] package-lock.json | npm Docs  
> A manifestation of the manifest  
> [https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json)  
## Backend
- Whenever the SpringBoot Application runs, DataSeeder executes and adds the seed-user into the db
- Beans are objects,
    1. Spring context is loaded
    2. Spring container which has all the objects that are needed to run the application
@Bean → Method level annotation
@Component → Class level annotation
### Tests
- TDD on Service, Unit Test
- In-memory DB (H2 DB) for Integration Test (instead of actual DB or mock DB)
- Integration test (1 happy path & 1 Exception path)
- JPA will be used to test the repository so we don't unit test it
- Model Class → @Entity and @Table
![[Untitled 2.png|Untitled 2.png]]
- [x] Try to do the repo calls in a different way
---
- You can either write a native query in the repository itself (DB first approach)
- Or I can get all the things from db and do the logic in service layer (Code first approach)
- all the configurations in application.yml or application.properties
- application-local.yml is for local configurations, could be part of .gitignore
- Architecture Decision Record (ADR) → md file to document all the decisions
- Docker compose - spins up containers for frontend, backend and db
- /swagger to visualise the endpoints
- for microservices, docker compose would spin up those images