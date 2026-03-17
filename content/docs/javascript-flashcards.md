Code 25 flashcards on javascript syntax
 1. What is the syntax for creating a function in JavaScript?
  Answer: function myFunction() { // code here }

2. What is the syntax for a for loop in JavaScript?
  Answer: for (let i = 0; i < array.length; i++) { // code here }

3. How do you declare a variable in JavaScript?
  Answer: let myVariable; or let myVariable = value;

4. What is the syntax for an if statement in JavaScript?
  Answer: if (condition) { // code here }

5. What is the syntax for a while loop in JavaScript?
  Answer: while (condition) { // code here }
  
6. How do you comment out code in JavaScript? 
  Answer: // this is a comment or /* this is a multi-line comment */ 
  		  		  		  		  		  		  		  		  		   
7. What is the syntax to access an object property in JavaScript? 

  Answer: objectName.propertyName; or objectName['propertyName'];

8. How do you create an array in JavaScript? 

  Answer: let myArray = [element1, element2, element3];

9. What is the syntax for declaring a class in JavaScript?

  Answer: class ClassName { constructor() {//code here} }

10. How do you write a switch statement in JavaScript?

  Answer: switch (expression) { case value1: // code break; case value2:// code break; default://code break;}   

11. How do you write an anonymous function in JavaScript?

    Answer: const myFunction = () => { //code here };

12. How do you define an event handler function using javascript syntax?

    Answer: elementName.addEventListener('event', function() {//code here}); or elementName['on' + event] = function() {//code here};

13. What is the syntax to loop through all elements of an array using javascript ?

    Answer: arrayName.forEach(element => { //code }); or for(let i=0;i<arrayName.length;i++){let currentElement=arrayName[i];// code}    

14. How do you access an element by its ID using javascript ?    

    Answer: document.getElementById('myID');    

15. How do you declare a constant variable using javascript ?    

    Answer: const myVariable = value;    

16 .How would you use parseInt to convert a string to an integer ?    

    Answer : let number = parseInt(stringValue);    

17 .How would you check if two values are equal using javascript ?    

   Answer : if (value1 === value2) {//code}     
     
18 .What does "===" mean and what does it used for ?     

   Answer : "===" stands for strict equality and it compares two values to check whether they are equal without any type conversion applied on them first, meaning that they must have both same type and same value to be considered as equal by this operator     
     
19 .What does "!==" mean and what does it used for ?     

   Answer : "!==" stands for strict inequality and it checks whether two values are not equal by comparing both their type and their value, meaning that only when both have different type or different value then they will be considered as unequal by this operator     
     
20 .How would you access multiple elements with same class name ?      

   Answer : document.getElementsByClassname('classname');      
      
21 .How would you add an event listener on multiple elements at once without looping over them individually ?      

   Answer : document.querySelectorAll('elements').forEach(element =>{element.addEventListener('event',function(){//code})});       
      
22 .What does "this" keyword refer to inside a function ?       

   Answer : The "this" keyword inside of functions refers to the object that called the function itself, meaning that it can refer either directly to window object if called from global scope, or refer to either parent object or callee depending on how it was invoked

Code 25 more flashcards on javascript syntax
 23. How do you define a global variable in JavaScript?
Answer: By not using the keywords let, const, or var when declaring the variable.

24. How do you declare an object in JavaScript?
Answer: let myObject = { property1 : value1, property2 : value2 };

25. How do you access the first element of an array in JavaScript? 
Answer: arrayName[0];

Code 25 flashcards on javascript syntax
 26. How do you access the last element of an array in JavaScript?
Answer: arrayName[arrayName.length-1];

27. How do you create a function expression in JavaScript? 
Answer: let myFunction = function() { // code here }

28. What is the syntax for a do-while loop in JavaScript? 
Answer: do { // code here } while (condition); 

29. How do you iterate over an object's properties in JavaScript? 
Answer: for (let property in objectName) { // code here } 

30. How do you access the value of a key in an object using bracket notation? 
Answer: objectName['key']; 

31. How do you access the value of a key in an object using dot notation? 
Answer: objectName.key; 

32. What is the syntax to access an index of an array using bracket notation? 
Answer: arrayName[index];  

33. What is the syntax to call a function and pass arguments to it? 

Answer: myFunction(argument1, argument2, ...);

Code 25 flashcards on advanced javascript syntax
 34. How do you use the spread operator in JavaScript? 
Answer: let newArray = [...oldArray]; 

35. How do you use the rest parameter in JavaScript? 
Answer: function myFunction(...rest) { // code here } 

36. How do you destructure an object in JavaScript? 
Answer: let { property1, property2 } = myObject;  

37. What is the syntax to create a default parameter in a function? 
Answer: function myFunction(parameter = defaultValue) { // code here } 

38. How do you use arrow functions with implicit returns? 
Answer: const myFunction = () => expression;  

39. What is the syntax to access a value from an array of objects using the find() method? 
Answer: let result = arrayName.find(element => element.property === value);  

40. How do you use the reduce() method on an array of objects? 

Answer: let result = arrayName.reduce((accumulator, currentValue) => { // code here }, initialValue);  

41. How do you use try/catch blocks for error handling in JavaScript?  

Answer: try { // code } catch (error) { // code }  

42. What is the syntax for creating a getter and setter using Object.defineProperty() method? 

Answer: Object.defineProperty(myObject, 'property', { get() {//code}, set(value) {//code} });    

43. What is the syntax to create a class that extends another class in JavaScript? 

 Answer: class SubClass extends SuperClass { constructor() { super(); //code here } }  

44. How do you create a getter and setter inside an ES6 class definition ? 

 Answer: get propertyName(){//code} set propertyName(value){//code}  

45. What is the syntax to call a parent's method from inside an ES6 class ?    

 Answer : super.[methodName]();
