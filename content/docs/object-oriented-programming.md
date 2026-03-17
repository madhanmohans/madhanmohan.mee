- Class
    - Behaviour & State
- Behaviour takes more precedence than State, we define states
- Do not over-engineer on things
- No Setters
  
|   |   |
|---|---|
|Encapsulation|Data Hiding|
|Abstraction|Implementation Hiding|
## Encapsulation
- Binds the state inside the class with the behaviour of the class
## Abstraction
- Abstract classes - can or cannot implement methods, c
- Interfaces - contracts having a set of methods (extends) - have to override all behaviours
    - Default methods, which can be implemented in Interfaces
    - it’s because we can have different implementations and properties for classes that implements the interface (coffee vending machine)
    - have to have set of implementations but how to do it, is taken care of is allowed for the classes that extends it
- We cannot ‘Draw’ an abstract class or interface, but we can ‘Draw’ a concrete class

> [!important]  
> All members of an interface are public and abstract by default!  
## Polymorphism
### Compile Time
- 1 Interface(method name) having multiple behaviours
- Kind of behaviour is defined based on the method signature (parameter list (type or number))
- Method overloading
    - add(int a, int b) and add(float a, float b)
- Operator overloading
    - 3+3=6 and “Yes” + “ Alright” = “Yes Alright”
### Run Time
- 1 Kind of class having multiple behaviours (Parent method → Child method)
- Method overwriting
- Kind of method that will be invoked depends on the type of object that’s been created (Parent type or Child type)
### Dynamic method dispatch
- Creating an object of child and assigning to the parent type
- Try Downcast and Upcast (find out whether it is happening runtime or compile time)
- Polymorphism stands out as one of OOPs most significant features. You can replicate the other three pillars in a procedural code but polymorphic behaviour is not easy to replicate (still possible).
## Inheritance
- Deriving a base class
- Should be used only when
    - both parent and child should be of same logical domain
    - Child Class is a proper subtype of the Parent Class (mostly, One → Many) (_**is a relationship**_)
    - the child class should do something additive to the parent class
    - parent class implementations should be necessary for the child class
## Composition (Example: Human body has leg, hand, And each organ /part has it own behaviours)
## Tell Don’t ask
- The way the requirements come in, we naturally move into the OOPs concepts, organically evolve, like introducing interface Shape as and when there is a requirement to add another Shape
- Behaviours → States (as and when needed)
- Creating classes and modeling objects will make your life easier

> [!important]  
> Ball ball1;Box box1;we can use, Shape ball1, box1, etc.  
getters and setters disadvantages
- Dead code (some won’t be used)
- Expose to