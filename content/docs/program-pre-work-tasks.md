
- Create Factorial Project
- Switch to project window
- Create a test class inside the src/test/java - FactorialCalculatorTest
- Create a test method 
- return1IfTheNumberIsLessThan2
- new FactorialCalculator(1)
- Quick fix - Create a class inside the src/main/java - FactorialCalculator
- Quick fix - create a data field for the parameter
- Go to test class
- Extract variable new FactorialCalculator(1)
- new FactorialCalculator.calculate()
- Quick fix - create a method inside the class
- return type int; return value 0;
- Extract variable new FactorialCalculator.calculate()
- Assertions.assertEquals("0", fc.calculate(0));
- Assertions.assertEquals("1", fc.calculate(0));
- 


