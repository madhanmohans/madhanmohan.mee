## Divide your page into two columns.
The narrower left column is for recording keywords, questions, and recall prompts. The right column is for your actual notes taken during a lecture or class.
### Recall
  
KEYWORD
  
RELEVANT QUESTION
  
### Notes
- ....
- ....
- ....
- ....
- ....
## Create a summary section at the bottom.
When you review your notes, briefly summarize what you learned and what is important to retain from the full page of notes. This will help you internalize the information.
## Here's an example:
We promise, a template is coming below!
### Recall
**What is the definition of propaganda?**
  
**What are the 4 techniques used by advertisers?**
  
**What is an example?**
### Notes
- Propaganda is messages intended to persuade audiences to adopt a certain option.
- Advertisers use propaganda using 4 techniques:
    - Testimonial
    - Bandwagon
    - Plain folks
    - Transfer
- Testimonial example: Michael Jordan sells Nike shoes

> [!important]  
> SUMMARY: Advertisers use propaganda to sell products, and use 4 different techniques to do so.  
### Date: October 5, 2019
### Topic:
### Recall
### Notes
- ...
- ...

> [!important]  
> SUMMARY:  
  
---
  
### Date: April 22, 2021
### Topic: DBMS
### Recall
Total Participation
What is Partial Participation?
Schema
Relationship
What is ER Diagram?
  
  
Simple Attribute
Composite
Multivalued
Derived
  
  
### Notes
- All entities participate in relationships
- Only some entities participate in relationships
  
- Headings
- Table
- Rectangles represent entity sets
- Diamonds represent relationship sets
- Attributes listed inside entity rectangle
Cannot be split
Can be split
Phonenumber
DOB → Age
  

> [!important]  
> SUMMARY:  
  
---
  
### Date: April 19, 2021
### Topic: Design and analysis of algorithms - Day 1
### Recall
Steps for algorithmic problem solving
  
  
  
  
  
  
  
  
  
  
  
  
GCD algorithms
Euclid's algorithm
  
Prime factor - Efficient way to find
### Notes
- Understand the problem (Input and Outpu)
- Computational Device (Parallel/Sequential algorithm)
- Decide on the data structure(Algorithm + DS is efficient?)
- Exact or Approximate - the output
- Represent the algorithm
    - Natural Language - leads to ambiguity
    - Flow charts - modification is tough
    - Pseudo Code - Standard
- Validate Input and Output - prove the correctness - Hypothetical Testing _(Mathematical induction)_
- **Test the efficiency** - time - how fast - space - how much memory it utilizes(now, since for the advancement in memory, not a common problem, in cloud computing might be used) - complexities
- **Optimality**
  
GCD(m,n) = GCD(n, m mod n) - Recursion - until n =0;
Using Prime factors - and find the multiple of common factors
Sieve of Eratothenes

> [!important]  
> SUMMARY: Basic Introduction to analysis of algorithms are given.  
---
### Date: April 20, 2021
### Topic: Design and analysis of algorithms - Day 1
### Recall
Towers of Hanoi
Data Structures
  
  
  
  
  
  
  
  
  
  
  
  
Dijikstra algorithm
Prim's algorithm
  
Analysis of Algorithm
  
  
  
  
Sum of n random numbers
  
  
  
  
  
ANALYSIS FRAMEWORK
### Notes
- 2^n - exponential
- Linear
    - List
        - Array
        - Linked List
        - String
    - Stack - LIFO
    - Queue - FIFO
    - Priority Queue/Heap - Ascending Order PQ - Delmin - Descending Order PQ - Delmax - minheap - maxheap
- Non-Liner
    - Graph - G(V, E)
    - Tree and Binary Tree
    - Set - collection of ordered items and Dictionary - Key-value pair.
- Single source shortest path algo
- Minimum Spanning Tree
  
- Issues:
- Approaches:
    - Theoretical
    - Empirical
- (a[], n)
- sum = 0;count = 0;
- while count < n {
    - sum = sum + a[count]
    - count++
    - }
- print sum;
  
1. Measure the input size - If linear array - input size = n; If matrix - input size = mxn - order of the matrix; If polynomial - degree and coefficient;
    1. For finding odd or even, prime or not - input size? - number of bits representing the value, so if 11, size will be 4;
    2. Identify the Basic Operation - Measure the Running Time; operation found in the innermost loop is considered as the basic operation - most time-consuming operation.
        1. T(n) = copC(n)
            1. T - total time
            2. cop - cost of a single operation
            3. C - count of basic operation
    3. Best - Worst - Average Case
        1. Searching algorithm
            1. If time depends on the order of the input in addition to the size of the input
            2. worst case - key not found or key found at the last position.
            3. Best case - key found at the first position
            4. Average case - Between - (n+1)/2
            5. Order of growth - depending on processing speed and input size - Analysis

> [!important]  
> SUMMARY: Prims and Dijikstra's algorithm - Programming assignment  
---
### Date: April 20, 2021
### Topic: DBMS
### Recall
Database System Architecture
  
  
  
  
  
  
  
  
  
  
  
Database Administrator
  
Query Processor
  
  
  
  
Three levels of abstraction/Three schema architecture
### Notes
![[Untitled 14.png|Untitled 14.png]]
- Coordinates all the activities of the database system
- Schema definition
  
- Data Definition Languauge(DDL) Interpretor
    - Interprets DDL statements and record the defintions in the data dictionary.
- [DML](https://en.wikipedia.org/wiki/Data_manipulation_language) complier
---
- Physical Level - how data are actually stored in memory
- Logical Level - days stored in database and the relationships among them
- View Level - highest level of abstraction - describes only part of the entire database.
  

> [!important]  
> SUMMARY:  
---
### Date: April 7, 2021
### Topic: Intro to Data Structures and Arrays
### Recall
What is Ds?
The things you know about DS
  
  
What is an Array?
### Notes
- Method and techniques to to maintain data in an organized manner.
- Listed some data structures
- Big O Notation On Ologn On^2 O1
- Sizes of primitive data structures
- Array is a list of same types of element stored in a continuous manner.
- Static and Dynamic
- Time complexities of operations on Array

> [!important]  
> SUMMARY: Understood something today, have to jump in deep tomorrow to understand and familiarize the concept.  
---