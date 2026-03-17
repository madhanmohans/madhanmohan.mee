In programming, contracts refer to a set of rules or agreements that a software component should follow. They define the obligations and benefits of the component in interaction with other components. 

Contracts can include aspects such as input and output types, preconditions, postconditions, and invariants. Ensuring that components adhere to these contracts is crucial in maintaining the overall integrity and reliability of a software system.

For example, consider a simple contract in Java for a method that calculates the square of a number. The contract could specify that the method takes an integer as input and returns an integer as output. It could also specify a precondition that the input must be non-negative, and a postcondition that the output must also be non-negative.

Here's how that might look in code:
```Java
public int square(int number) {
    // Precondition: number must be non-negative
    assert number >= 0 : "Number must be non-negative";
    int result = number * number;
    // Postcondition: result must be non-negative
    assert result >= 0 : "Result must be non-negative";
    return result;
}
```

In this code, the `assert` keyword is used to enforce the preconditions and postconditions of the contract. If the condition in the assert statement is not met, the program will throw an AssertionError, indicating that the contract has been violated.