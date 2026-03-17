As a fan of geometry, I want to know the area and perimeter of a square
  
All of the information in the commit message is redundant - you can find out _what classes you added , what lines you added_ if you do git whatchanged <commit-hash> or git diff <commit-hash>
Mentioning unit test in commit messages is okay when sometimes your codebase does not have tests and you are explicitly working on adding tests. Otherwise, it is implicit that you did TDD and added unit tests
Commit messages → meaningful to the business requirements
Before committing - Cmd + Option + L
Beck Design Rules:
- Passes the tests
- Reveals intention
- No duplication
- Fewest elements
Not every usage of a number is a magic number . In this context try asking a question to yourself “what is the formula to compute perimeter of a square” - your answer would be 4 * side . You would never say “number of sides * side” . So just represent this.
Similarly when you ask the formula for an area of a circle you say “pi r square” and not “3.14 r square”.
So have appropriate representations for the way its represented in the real world
Reveals intention > Remove duplication . By that , if having 4 better represents your behaviour use that
Anti pattern to have anemic classes
Strong relationship between parent and child class
You aren’t gonna need it
  
- Static → behaviours should not be static
- While creating objects (static method) static can be used
- create some objects based on arguments and when we need to abstract it away from the user,
- When you want to abstract / strategise the object instantiation, we go with this - static factory method.
---
Try writing rectangle code with just static methods
---
[[DAO vs DTO]]