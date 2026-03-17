> [!info] SOLID Principles: How to create a code that is easy to extend and maintain- Part 1  
> Object Oriented Programming, like other programming paradigms, was created initially to standardize the pillars, syntax and rules to be able to create a code in an understandable standard format and thus avoid falling into the creation of a spaghetti of variables, functions and classes flying between files and folders that in the end will become a difficult creature to tame, imagine then having to include a new functionality, it would be a challenge for the brave.  
> [Source](https://www.thoughtworks.com/en-in/insights/blog/agile-engineering-practices/solid-principles-how-to-create-a-code-that-is-easy-to-extend-and-maintain-part-1)
## Summary:
Object Oriented Programming (OOP) was developed to standardize programming practices and avoid creating complex and difficult-to-maintain code. SOLID principles, including Single Responsibility and Open Close, aim to promote clean, scalable, and maintainable code through design patterns. Violations of these principles can lead to code duplication and conflicts. By adhering to these principles and using interfaces, developers can create flexible and extensible systems.
## Key Points:
### Object Oriented Programming (OOP) Foundation
- OOP was created to standardize coding practices and prevent the development of tangled, hard-to-manage code 
- Practices like design patterns help ensure clean and maintainable code
### SOLID Principles
- The SOLID principles (Single Responsibility, Open Close, Liskov Substitution, Interface Segregation, Dependency Injection) promote cohesion and reduced coupling in software design
- Single Responsibility Principle (SRP) - ==Separation of Concerns== - emphasizes having a single responsibility for functions, classes, and modules to prevent unnecessary changes and maintain code clarity
- Examples, like a class handling both client attributes and database operations, illustrate violations of the SRP and the need for separation of concerns
- Example - Service layer, Controller layer, DTO layer
### Open Close Principle (OCP)
- The Open Close Principle advocates for code that is open for extension but closed for modification
- An example using the OCP to calculate the area of geometric figures showcases the importance of abstraction and scalability
### Overcoming Design Challenges
- Using interfaces to define contracts and decouple logic enables scalability and flexibility in software development
- Strategies like the Strategy Pattern allow for different approaches to solving the same problem by encapsulating them under a common context
### Looking Ahead
- Principles like Liskov Substitution and Interface Segregation are crucial for creating easily extendable and maintainable code
- Disclaimer states that the views expressed are those of the author and not necessarily reflective of the company
---

> [!info] SOLID Principles: How to create a code that is easy to extend and maintain - Part 2
> In this second entry, we continue telling you about the SOLID principles, to maintain order when programming, with examples from day to day.  
> [Source](https://www.thoughtworks.com/en-in/insights/blog/agile-engineering-practices/solid-principles-how-to-create-a-code-that-is-easy-to-extend-and-maintain-part-2)
## Summary
This document continues discussing the SOLID principles, explaining LSP (Liskov Substitution Principle) and ISP (Interface Segregation Principle). LSP focuses on preserving behavioral properties between subtypes and super types, while ISP states that clients should not be forced to rely on interfaces they do not use.
## Key Points
### Liskov Substitution Principle (LSP)
- LSP, named after Barbara Liskov, focuses on defining the subtype relationship to ensure that objects can preserve the behavioral properties of their supertypes 
- The subtype relationship is based on the specifications of the sub and super types
- Mathematical rules created by Liskov state that the main class or client should only use the methods of the parent class and the child class must not alter the behavior of the parent class's methods
- Contravariance of Arguments and Result covariance are essential conditions to be met
- Rules for exceptions, pre-condition, and post-condition are also defined under LSP
- Class invariance and constraint rule are also part of LSP principles
### Interface Segregation Principle (ISP)
- ISP states that clients should not be forced to rely on interfaces they do not use
- It emphasizes the need to extract the definition of certain functionalities from a high-level interface and make use of inheritance or the composition of functions to compose an interface according to the client's concept 
- Bulky interface is a code smell
- The document provides an illustrative example of how ISP can be applied with birds (eagle and penguin) and the need for interface segregation in this scenario 
### Other
- The document mentions the need to delve into the Dependency Inversion Principle (DIP) in the final part, along with key concepts to help plan and create code, avoiding errors continuously
- A disclaimer at the end indicates that the statements and opinions expressed in the document are those of the author(s) and do not necessarily reflect the positions of the company
---

> [!info] SOLID Principles: How to create a code that is easy to extend and maintain- Part 3  
> Object Oriented Programming, like other programming paradigms, was created initially to standardize the pillars, syntax and rules to be able to create a code in an understandable standard format and thus avoid falling into the creation of a spaghetti of variables, functions and classes flying between files and folders that in the end will become a difficult creature to tame, imagine then having to include a new functionality, it would be a challenge for the brave.  
> [Source](https://www.thoughtworks.com/insights/blog/agile-engineering-practices/solid-principles-how-to-create-a-code-that-is-easy-to-extend-and-maintain-part-3)
## Summary
The Dependency Inversion Principle is discussed in this document, highlighting the importance of high-level modules not depending on low-level modules directly, but both relying on abstractions. By abstracting dependencies and details, code becomes easier to extend and maintain, following clean programming practices and design patterns.
## Key Points
### Dependency Inversion Principle
- High-level modules should not depend directly on low-level modules, but both should rely on abstractions
- Abstractions should not depend on details, but details should depend on abstractions
- Dependency and coupling are important concepts when measuring the impact of changes in an application
- Implementing interfaces and using design patterns like the Adapter pattern can help in decoupling modules and following the Dependency Inversion Principes
### Application of Principles
- Understanding the difference between high-level and low-level modules in software development is crucial for applying the Dependency Inversion Principle
- Creating abstractions and interfaces can help in making code more adaptable to changes and easier to extend.
- Following SOLID principles, like the Dependency Inversion Principle, leads to the creation of clean, maintainable code
- Practicing good coding habits and using design patterns can contribute to creating organized and understandable code for collaboration 
### Conclusion
- Adhering to SOLID principles and design patterns can benefit programming professionals by facilitating clean, extendable, and maintainable code 
- Empathy towards future code maintainers is crucial in maintaining a well-structured and organized codebase 
---