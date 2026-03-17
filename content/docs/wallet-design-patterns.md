## Contract
- Constructor can reveal multiple intents, so it is part of a contract
- Contracts are method signatures not method body
- As an API provider, you cannot ship buggy code to your client that can throw any unchecked exception
- Everything that is exposed to the client is contract
## Method Contract:

- Annotations
- Compile time exceptions
- Arguments (Method Signature)
- Method Name
- Access modifiers

- If condition inside of the method
- Variable that the method declares
- Compile time exceptions that method throws
- Name of the method
- Variable that method mutates
- Annotations
- Return type of the method
- Runtime exceptions the method throws
- Types of the parameters method takes
- Names of the parameters method takes
- Access modifier of the method
 
## Class Contract:
- Public methods
- Public states
- Class Name
- Annotations

Public Methods
This option is correct. Public methods of a class define its external behavior and are part of its contract.
    
Private Methods
    
This option is incorrect. Private methods are implementation details that are not part of a class's contract.
    
Constructor and Parameters for the constructor
    
This option is correct. The constructor and its parameters are part of a class's contract because they define how an instance of the class is created.

Public Fields

This option is correct. Public fields of a class are part of its contract because they define the state of the class that is visible to its clients. However, it is important to use caution when using public fields, as they can expose the internal state of the class and make it difficult to maintain class invariants and ensure proper encapsulation.

Private Fields

This option is incorrect. Private fields are implementation details that are not part of a class's contract.

Access modifiers

This option is correct. Access modifiers (such as public, private, or protected) are part of a class's contract because they specify the visibility and accessibility of its members.

Exceptions

This option is incorrect. Exceptions are not part of a class's contract, as they are used to handle exceptional or unexpected conditions during execution, rather than defining the expected behavior or functionality of the class.

Parent class & Interfaces

This option is correct. The parent class and implemented interfaces of a class define its inheritance and interface contracts, respectively.

Class Name

This option is correct. The name of a class is part of its contract because it identifies the class and distinguishes it from other classes.

Annotations

This option is correct. Annotations can be used to provide additional information about a class's behavior, such as its expected usage.

---
- Think about what all the responsibilities that the class can have and start building from it.
- Single responsibility allows reusability, and classes won’t be bloated, difficult to segregate
- Software design is always about tradeoff
- Types of API structuring
	- Domain based or Action based structure in API (Having all CRUD in one class or Having all Get controllers, Update controllers etc. in different classes)
- Both class and method should have single responsibility meaning it should not handle more things out of other plates.
- Rather than asking an object for data and acting on that data, we should instead tell an object what to do.
- Circle is an anemic class, i.e. a type of class in object-oriented programming that may have getters and setters for its fields but lacks any significant behaviour or logic.
- The "Tell Don't Ask" principle suggests that an object should not reveal its internal state to other objects but rather should communicate only through well-defined interfaces.
- Instead of asking the rupees value in put method in wallet, we should tell it add the rupees in the rupees class itself
- Only having getters and setters (anaemic)
- In Java, a method contract is a set of rules and expectations that must be met by a method in order for it to be considered a valid and functional part of a program.
A method contract consists of the following elements:
- Method name
- Access specifier
- Return type
- Parameters
- Method body
## Fluent Interface or Method Chain
Rupee1 + Rupee2 + Rupee3 → CPP → Operator Overloading
Rupee1.add(Rupee2).add(Rupee3) → Java → Fluent Interface
Read → Build Design Pattern
Every method of the chain will always return an object of some class
Stream API is an example Stream.filter().map()
```JavaScript
package com.example.wallet;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import org.junit.jupiter.api.Test;
public class RupeeTest {
@Test
void shouldReturnZeroRupeeWhenZeroRupeeIsAdded() {
Rupee rupee = new Rupee(0);
Rupee expectedZeroRupee = new Rupee(0);
Rupee actualZeroRupee = rupee.add(new Rupee(0));
assertThat(actualZeroRupee, is(expectedZeroRupee));
}
@Test
void shouldReturnSeventyRupeeWhenSeventyRupeeIsAdded() {
Rupee rupee = new Rupee(0);
Rupee expectedSeventyRupee = new Rupee(70);
Rupee actualSeventyRupee = rupee.add(new Rupee(70));
assertThat(actualSeventyRupee, is(expectedSeventyRupee));
}
@Test
void shouldReturnHundredRupeeWhenSeventyRupeeAndThirtyRupeeAreAdded() {
Rupee rupee = new Rupee(0);
Rupee expectedHundredRupee = new Rupee(100);
Rupee actualHundredRupee = rupee.add(new Rupee(70)).add(new Rupee(30));
assertThat(actualHundredRupee, is(expectedHundredRupee));
}
}
```
---
## Value Object
- Immutability → will have only immutable values
- Value Equality → Two value objects having same value are considered same (2 one rupees), so we only need to compare the values instead of object references.
- Self Validation → Since they are dependent on the value, the validation for the value with which it is created is needed internally within the object
- Phone numbers can be value objects that abide by expected validation criteria as required by our system.
- Replacable
- Every state in your class which is a primitive is a potential value objects
- example: longitude and latitude
- fewer elements is not needed , if behaviours are assoicated with primitive → Value object candidate
## Identity Object
- They are not defined by their attributes
- One particular unique identifier ID
- Entity objects or Entities
- can have immutable and mutable objects (at least one immutable)
- Irrepalacable

> [!important]  
> Domain objects represent entities with identity and may have mutable state, while domain value objects represent concepts and are immutable, solely defined by their attributes  

> [!important]  
> The contract between equals and hashCode is that if two objects are equal (obj1.equals(obj2) returns true), then their hash codes must be equal as well (obj1.hashCode() == obj2.hashCode()).See the implementation of the 2 methods below, you can see that the hashcode is what is being compared in the equals object (doubleToLongBits(value))  
  
> [!important]  
> Therefore, whenever we override the equals method, we should also override the hashCode method to ensure consistent behavior in hash-based collections.  
```Java
 /**
     * Returns a hash code for a {@code double} value; compatible with
     * {@code Double.hashCode()}.
     *
     * @param value the value to hash
     * @return a hash code value for a {@code double} value.
     * @since 1.8
     */
     
 public static int hashCode(double value) {
        long bits = doubleToLongBits(value);
        return (int)(bits ^ (bits >>> 32));
  }
  
  /**
     * Compares the two specified {@code double} values. The sign
     * of the integer value returned is the same as that of the
     * integer that would be returned by the call:
     * <pre>
     *    new Double(d1).compareTo(new Double(d2))
     * </pre>
     *
     * @param   d1        the first {@code double} to compare
     * @param   d2        the second {@code double} to compare
     * @return  the value {@code 0} if {@code d1} is
     *          numerically equal to {@code d2}; a value less than
     *          {@code 0} if {@code d1} is numerically less than
     *          {@code d2}; and a value greater than {@code 0}
     *          if {@code d1} is numerically greater than
     *          {@code d2}.
     * @since 1.4
     */
    public static int compare(double d1, double d2) {
        if (d1 < d2)
            return -1; // Neither val is NaN, thisVal is smaller
        if (d1 > d2)
            return 1; // Neither val is NaN, thisVal is larger
        
	// Cannot use doubleToRawLongBits because of possibility of NaNs.
        long thisBits    = Double.doubleToLongBits(d1);
        long anotherBits = Double.doubleToLongBits(d2);
        return (thisBits == anotherBits ?  0 : // Values are equal
			(thisBits < anotherBits ? -1 : // (-0.0, 0.0) or (!NaN, NaN)
			 1));                          // (0.0, -0.0) or (NaN, !NaN)
    }
```
  
## equals(Object o)

- Same object check (this == object)
- null object check (object == null)
- different class check (getClass() ≠ object.getClass())
- compare the values [Double.compare](http://Double.compare) or [Int.compare](http://Int.compare) or anything return true if its 0

---
Understand Hash Collision
Look at how Hashmap or Hashset is internally implemented, you'll find why hashcode is an int. It’s a combination of arrays, linked lists and B+ trees. Its actually very fascinating

---
Bucket is range of hash values
Objects are stored in Heap
Good to know
	In any domain that involves monetary calculations you should avoid using float or double to store your value. 
	Big Decimal should be your choice  
  
[https://dzone.com/articles/never-use-float-and-double-for-monetary-calculatio](https://dzone.com/articles/never-use-float-and-double-for-monetary-calculatio)
We have to implement the hashcode in such a way that the two rupee objects having same value return hash code.
See how integers implementation of hashcode
That means hashCode() will be executed first before equals() method by hash collection right ?
Create parent and child class override hashcode and equals

---