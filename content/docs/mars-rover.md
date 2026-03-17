## String Builder
- + and .concat gives the same output.. but how do they work internally?
- String objects create concat
- See how String builder is concatenating
- Read Google, Meta Engineering blogs
- String Buffer is thread safe (methods are synchronised) and String Builder is not thread safe
- Data clumps → xCoordinate, yCoordinate, direction → encapsulated into a class and have behaviours
- If we don’t override the toString() method, the the Object implementation of comparing String

> [!important]  
> direction.turnRight()  
![[Untitled 7.png|Untitled 7.png]]
- this.ordinal is same like index
- Validate commands → enum → validate in input parser class
- Why IntelliJ extracts out to static
```Java
MarsRover -> processCommand()
Position -> move(), turnRight(), turnLeft()
```
![[Untitled 1.png]]

> [!important]  
> Task: Do the above thing without ladder.  
## Behaviour attachment
![[Untitled 2 2.png|Untitled 2 2.png]]
## using enums
![[Untitled 3 2.png|Untitled 3 2.png]]
![[Untitled 4.png]]
- Open close principle is broken when the L R M commands is handled in switch case

> [!important]  
> First Identify things that you are broken → the Implementation- Like liskov principle is broken using inheritance → used composition- Like switch case or ir else ladder is used → break open close principle, if using objects and its behaviours , think about polymorphism to solve.  
using command class:
![[Untitled 5.png]]
```Java
public Position execute(Position position) //ICommand
```
![[Untitled 6.png]]
**Command**: Encapsulates a request as an object, thereby letting you parameterize clients with queues, requests, and operations, and supports undoable operations.
Example: Remote button
- Go through a Factory Class, just like this, object creation does not violate Open Close Principle

> [!important]  
> Identify Models and making them interact within them