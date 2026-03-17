/api/users → URI
[http://www.example.com/api/users/1](http://www.example.com/api/users/1) → URL
## HTTP Methods:

> [!important]  
> Non RESTfulPOST - Create user. /RegisterUserServletGET - Read user details./GetUserDetailsServlet?userID=1POST - Update user details/UpdateUserDetailsServletGET - Delete user details/DeleteUserDetailsServlet?userID=1  
---

> [!important]  
> RESTfulPOST - Create user/usersGET - Read user details/users/1PUT - Update user details/users/1DELETE - Delete user details/users/1  
---
## Headers
### Request body type
- Content-Type ⇒ application/json
- (it can be anything, XML eg.)
### Response body type
- Accept ⇒ application/json
- (it can be anything, XML eg.)
- JSON ↔ Java Object
---
[[Mac Installations]]
- Dependency Injection helps us to handle the classes independently