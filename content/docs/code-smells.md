1. There is duplication
2. It has long method code smell
3. There is no encapsulation because of the exposed state
4. Compiler can't mandate all the required parameters are set by the user
5. Usage of static state makes it difficult to guess the contract, exposing counter intuitive API
6. There are magic numbers
7. There is no usage of any access modifier, the state can be mutated by anyone outside the class
8. There is no package declaration, missing name space
9. Unnecessary comments clutter the code
10. The code lacks meaningful variable names, leading to confusion
11. The code violates the Single Responsibility Principle, as methods carry out more than one function.
12. The code lacks exception handling which can lead to unexpected failures
13. There is no proper logging mechanism in place making it difficult to debug
14. The code does not follow a consistent naming convention, making it harder to maintain
15. Code readability is compromised due to lack of formatting and indentation
16. The code is not modular, making it difficult to extend and modify
17. There are no unit tests, making it risky to make changes to the code
18. The code does not follow the principle of least surprise, leading to confusion and errors
19. The code lacks clear separation of concerns, with UI, business logic, and database operations all mixed together
20. The code does not use dependency injection, making it less modular and harder to test
21. The code has no error handling for edge cases, leaving the system vulnerable to crashes
22. The code lacks defensive programming, making it susceptible to bugs and errors
23. The code does not adhere to the DRY (Don't Repeat Yourself) principle, leading to redundancy and increased risk of errors
24. There is no use of version control, making it hard to keep track of changes and collaborate with others
25. The code is not optimized for performance, leading to slow execution times and inefficient resource usage