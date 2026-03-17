- Why?
    - Role based access control
## Types
- Session based authentication
    - Use Cookies (session ID)
    - Stateful
    - Server will check with it’s in memory
- Token based authentication
---
## JWT
- Header (encryption algo, algo type)
- Payload (data)
- Signature
---
## Spring Security
![[Screenshot_2024-07-01_at_2.30.59aPM.png]]
- FrontendApp → Auth Controller → Bearer Token Authentication Filter → UserController → DispatcherServlet → App
- 401 Unauthorised → Authentication is invalid
- Request Header: Authentication: Bearer <Token>
**Analogy**: Imagine attending a large, ticketed event like a concert or sports game.
**Explanation**:
- **Authentication**: Purchasing a ticket verifies your attendance rights (authentication). Only ticket holders are allowed into the venue.
- **Token**: Your ticket acts as a token, a unique identifier (token) that grants access for a specific event and duration.
**Spring Security**: The event organizers (security staff) ensure only valid ticket holders (authenticated users) enter the venue. Each ticket (token) is checked against a list (authentication provider) to authorize entry.
---
Think of @Configuration classes as a recipe book for your application:
- The @Configuration class (AppConfig) is the book.
- Each @Bean method is a recipe for making a dish (bean).
- When Spring starts, it reads the book, follows each recipe, and prepares all the dishes (beans) ready for you to use in your application.
This process ensures that your application has all the necessary components (beans) ready and managed by Spring, making it easier to develop and maintain.
---
Configuration → Filter → DispatcherServlet
JwtAuthenticationFilter.java