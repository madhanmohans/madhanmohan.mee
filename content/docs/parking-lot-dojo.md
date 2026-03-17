Driver (User) **Actor** → Car (How?/Tool) **Medium** → Parking Lot (System) The box (System Boundary) → Noise (Flight)
  
- Have to park **my** Car and I want to somehow handle that in the ParkingSlot
    - meaning park should be functionality of the Car Class
- We don't care as of now about the availability of the parking slot.
- Car.park() seems like an implementation of how the car will park (like Tesla automation trying to park the car), we have to find other ways.
- Parking Lot (the whole space) → Parking Slot (a single space)
As a user,  
I want to <do something>  
So that <I can achieve something>  
<I can achieve something> is a business goal?
**As [a user persona], I want [to perform this action] so that [I can accomplish this goal]**
The last part is MY GOAL, not the System’s Goal.
You can interact with different personas having different end goals, but they can use the System (using Swiggy to make hunger go away/become fit)
## Marker Interface (when we don’t have implementation details and want to abstract away, for us to be able to create classes while testing(consumer))
- Parkable Interface can be used by System (Parking Lot)
- Test will contain the car because we are testing the car implementation of parkable here
- Anything that implements parkable interface can park in the parking lot
- Parking lot should not dictate what kind of car that is coming, anything that is parkable can be parked. When we only define parkingLot.park(Car), we are only allowing car to be parked while there can be N number of parkables.
- If we are even implementing it through parkable then won’t the car class still be anaemic?
    - It will but it won’t be in the main models but only for testing purposes.
    - Consumer is going to create an object for test,
    - Only Main models should not have to be anaemic (its better that the classes are rich in behaviour)
    - Parking lot could have some supporting classes, those can be anaemic (POJO.- Plain Old Java Objects)
    - It is not an hard and fast rule
- Instantiating objects in the Setup or @BeforeAll and @BeforeEach reduces code readability, unit test encapsulation
- Treat every test as independent unit
- Typically, test is the documentation, its where we refer the implementation, so each test should be clear on its own (talks about edge cases, happy path, negative path etc.)
- While committing something the top right in IntelliJ should have green ticks
- If your behaviour is not using your state then you do not need that state
- Another approach that is less preferable is to not have a Car class explicitly defined but use anonymous classes concept in java to create the car object.
- Any test should start with a failing test, if we start with the passing test, then it means we already tested that.
- We can’t have 2 assert statements in one unit test, violates single responsibility
- This assertion and the previous assertion give information about the number of cars parked , it doesn’t give the user of the parking lot system if a specific car got parked or not
    - This is when we use the counter/number of cars parked as to find if the second car is parked or not. The count doesn’t implicitly tell that this specific car is parked or not
- Our first way is to make the Car class know about its own state like isParked so that we test that.
- Contracts should not change from test case to test case perhaps
[[Command Query Separation]]
- You can ask the users to take an action with enum but you can’t force him
- You can force him with exception to take exception with try catch block
---
- return early when an exception is thrown
_**Law of early returns**_
So always handle the exception / error path first in your conditionals , return early and then keep the happy path at the end , when you do it this way , it will
1. Simplify code structure and improves readability.
2. Make functions easier to understand and maintain.
3.Facilitate more immediate and clearer error handling
- When we throw a custom exception, usually the exception message is not needed, and if the user depends upon the exception message, then that’s tight coupling and code breaks when that message is modified.
- It’s usually not needed, and in case of logging, developers usually log their own exception messages, when they catch the exceptions. So again, may get redundant to have it.
- It also depends on the use case, usually not recommended ( not a good practice)
- Exception is a subclass of Throwable
- Throwable is the superclass all the errors and exceptions