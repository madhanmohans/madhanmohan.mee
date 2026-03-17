> YAGNI = You are not gonna need it  
KISS = Keep it simple, silly  
DRY = Don’t repeat yourself

# programming paradigms

### procedural
- line-by-line (data, function) 
- separated throughout the program 
- therefore order matters
### functional
- function and data are separated (pure functions) 
- data is not directly manipulated
- copy of the data is manipulated

`const newState = function(oldState)`

### object oriented
- data + function are binded together
- multiple entities on top of blueprint (class)  
### uml
- High level
- No implementation details
### solid principles (dealing with OOPS)
- Single responsibility 
    - a class should have only one external reason to change
    - if not, the class is large
    - separate behaviour, storage, display etc. of a single class so that if any external factors change (new behaviour, new db, new FE client) you can edit the corresponding class
- Open-closed
    - open to extension
    - closed to modification
    - adding functionality by adding new classes
- Liskov substitution
    - Write code so that the Child class can be substittuted by the Parent class from everywhere in the code
- Interface segregation
    - you shouldn’t implement methods in the interface that are not relevant to the current class
    - segregate the interfaces so that all classes are properly defined by extending the appropriate interface
- Dependency inversion
    - dependencies (one class depending on another) refer to abstractions (interfaces) rather than an acutal class so that we can write classes that extend the high-level interfaces instead.


## Creational design patterns
- hiding the object creation from the client
- Creational pattern is often used as the way to access an application’s database or anything else that might not need to be instantiated more than once. 
- The Singleton pattern gives a codebase widespread access to the same singular instance of an object. 
- This pattern enforces that only one instance exists and prevents additional instances from being created.
## Structural design patterns
- combine objects into larger structures
- eg. Bridging patterns (horizontal scaling instead of inheritance)
- We seek to take a dimension of an object that is causing the number of subclasses to grow, turn that dimension into a class, and make an instance of that class an attribute of the base object.
## Behavioural design patterns
- whatever that is not creational/structural design patterns.
- The _Observer pattern_, a specific Behavioural pattern, allows us to add new entities listening in on these events and create new events that these objects can listen to. 

---
### MVC
Model - classes that describe how we store data and how we represent the stored data
View - classes that describe how we show data
Controller - how we control data (logical part) - brain

---