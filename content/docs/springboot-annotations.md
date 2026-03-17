![[Screenshot_2024-06-27_at_2.31.29_PM.png]]
## **Spring Annotations**
Spring leverages annotations to simplify configuration and manage the lifecycle of objects within your application. Here's a breakdown of some key annotations and concepts:
**Core Configuration Annotations:**
- `@Configuration`: Marks a class as a Java Bean containing configuration information. Spring will process these classes to generate bean definitions.
- `@ComponentScan`: Instructs Spring to scan a specific package or set of packages for classes annotated with Spring stereotypes (e.g., `@Component`, `@Controller`). This allows Spring to automatically discover and register beans.
- `@EnableAutoConfiguration`: Enables Spring Boot's auto-configuration capabilities. Spring Boot will automatically configure beans based on the libraries found on the classpath.
**Benefits of Annotations:**
- **Reduced Boilerplate:** Annotations eliminate the need for verbose XML configuration files, making code cleaner and easier to maintain.
- **Improved Configurability:** Annotations provide a declarative way to configure beans, making it easier to understand how components interact.
- **Centralized Management:** All configuration is defined within Java classes, promoting a unified approach to application setup.
**Dependency Injection (DI):**
Spring promotes dependency injection, a technique where objects don't create their own dependencies but are instead injected by an external source (typically the Spring container). This fosters loose coupling and testability in your application.
**Common Injection Methods:**
- **Constructor Injection (Recommended):** Dependencies are passed as constructor arguments. Spring automatically injects them during object creation. This approach is preferred as it enforces explicit dependencies and promotes immutability.
- **Setter Injection:** Dependencies are injected through setter methods. While convenient, it can lead to hidden dependencies and potential side effects.
- **Field Injection (Least Preferred):** Dependencies are directly injected into fields using annotations like `@Autowired`. This approach is discouraged as it bypasses constructor logic and reduces testability.
`**@Autowired**` **Annotation:**
- Used primarily for constructor injection. Annotates constructor arguments or setter methods to instruct Spring to automatically inject the required bean dependency.
**Bean Creation and Lifecycle:**
- When a Spring Boot application starts, Spring scans the application context for classes annotated with `@Component` or its derivatives (e.g., `@Controller`, `@Service`).
- For each discovered class, Spring creates a bean instance, manages its lifecycle (including initialization and destruction), and wires dependencies using autowiring or configuration.
**Stereotype Annotations:**
These annotations are specializations of `@Component` and provide additional context to Spring about a bean's purpose:
- `@Component`: Generic component class.
- `@Service`: Marks a class as a service layer component that implements business logic.
- `@Controller`: Denotes a web application controller class that handles incoming HTTP requests.
- `@Repository`: Identifies a class that interacts with data access layer (e.g., databases).
**Eager vs. Lazy Bean Creation:**
- **Eager:** Beans are created by Spring upfront during application startup. This approach is faster as objects are readily available for use but can consume more memory if some beans are rarely used.
- **Lazy:** Beans are created only when they are first requested. This saves memory but introduces a slight delay when a bean is accessed for the first time.
**Spring typically uses eager bean creation by default to ensure dependencies can be resolved upfront. However, in specific cases, you might consider lazy initialization.**