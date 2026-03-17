---
tags:
  - programming
  - design
---
Product Owner ↔ Clients
Assessment (Prototype) → Inception → Finalise on design/architecture → Evolve
### Some of the architectural patterns
- Micro-frontends
- Client-server
- serverless
- service-oriented
- event-driven
- monolithic
- hexagonal
- micro-services
## Monolithic application
- FrontEnd
- BackEnd
- Database
All of these in a single place
- Services are exposed through different ports
## Microservice application
- Each service will be packaged separately
- We can easily scale up the code

### Monolith
- Everything integrated in one single place
- Tightly couple application

> [!important]  
> A single point of failure (SPOF) is a potential risk posed by a flaw in the design, implementation or configuration of a circuit or system. SPOF refers to one fault or malfunction that can cause an entire system to stop operating.  
### Monolith evolves into Client Server
- Presentation in Client (Single Page App)
- Business logic, data access in Server (Web server)

> [!info] Scaling up the Prime Video audio/video monitoring service and reducing costs by 90%  
> The move from a distributed microservices architecture to a monolith application helped achieve higher scale, resilience, and reduce costs.  
> [https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90)  
### Microservices
- Separating into separate services
- UI <—> BFF <—> Services (Backend for Frontend)
- Different Backend for FrontEnd for different UIs (for example Mobile, UI etc)

> [!info] bliki: Monolith First  
> Going directly to a microservices architecture is risky, so consider building a monolithic system first.  
> [https://martinfowler.com/bliki/MonolithFirst.html](https://martinfowler.com/bliki/MonolithFirst.html)  
- BFF can call relevant services, get the data, put them together, and send the data to the UI. It can act as an orchestrator of the services for the UI.
- BFF can take care of Authentication

> [!important]  
> Starting with the service layer first makes the creation of the migration files also easier - you could avoid potential conflicts with the rest of the team while verisioningMeant service layer - you ll know what your models are and create the migrations accordingly.  

> [!important]  
> We can start with Presentation layer or Service layer, it depends on the type of requirement we deal with  
  
> [!important]  
> With NextJS, developers can enjoy a streamlined development experience where server-side rendering, static site generation, and API routes coexist harmoniously within a single codebase. NextJS represents a compelling evolution of the monolithic paradigm, adapting it to meet the needs of today's developers and users.  
Web Service —> Data Access —> Database


### C4 Model for visualising software architecture
### Level 1 Context (Customer User, Admin User)
- High level overview
- For everyone
- Tells the personas who are going to use the application
### Level 2 Container
![[Screenshot_2024-06-25_at_12.37.47_PM.png]]
- High level internal implementation
- Dev, BA, QA
### Level 3 Component (Web Application, Web Service, Database)
- Detailed view of each component
- Specific to Developers
![[Screenshot_2024-06-25_at_12.38.12_PM.png]]
### Level 4 Code
![[Screenshot_2024-06-25_at_12.44.27_PM.png]]
## Skyfox Layered Architecture
- Presentation - UI
- Sevice - Web Server
- Data Access - DB
![[Screenshot_2024-06-25_at_12.45.57_PM.png]]
- [ ] We have figure out where all these layers are in the project
