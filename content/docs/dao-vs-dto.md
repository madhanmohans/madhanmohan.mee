DTO → getters and setters
DAO → Abstraction on how to access the behaviour or states
Sure, here's a concise explanation:
DAO (Data Access Object):
- Represents an object that provides an abstract interface to a database or any other persistence mechanism.
- Separates business logic from database operations.
- Typically contains CRUD (Create, Read, Update, Delete) methods for interacting with data storage.
Example:
```Java
public interface UserDao {
    User findById(int id);
    void save(User user);
    void update(User user);
    void delete(User user);
}
```
DTO (Data Transfer Object):
- An object that carries data between processes or between different layers of an application.
- Contains only data fields with getters and setters.
- Used to simplify data exchange and reduce the number of method calls.
Example:
```Java
public class UserDTO {
    private String username;
    private String email;
    // Getters and setters
}
```