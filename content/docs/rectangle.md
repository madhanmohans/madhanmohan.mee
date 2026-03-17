- area, getArea, calculateArea, findArea
    - area is preferable, because the we can hide the underlying implementation
- Do not over engineer code
- Remember that a class having only getters and setters is not a well modelled class -
**Principle of least privilege**
In [information security](https://en.wikipedia.org/wiki/Information_security), computer science, and other fields, the **principle of least privilege** (**PoLP**), also known as the **principle of minimal privilege**(**PoMP**) or the **principle of least authority** (**PoLA**), requires that in a particular abstraction layer of a computing environment, every module (such as a process, a user, or a program, depending on the subject) must be able to access only the information and resources that are necessary for its legitimate purpose.(https://en.wikipedia.org/wiki/Principle_of_least_privilege\#cite_note-Saltzer_Schroeder_1975_pp._1278%E2%80%931308-1)
- Why we should have restricted usage of getters and setters.
`add negative test cases, zero cases, and large input test case`
- Contract - calculate Area - internal implementation should not affect the method names, should not break the contract by changing it to the million users who already use it.
- Not a good practice to rename methods
- Arrange - Class intantiations
- Act - invoke methods
- Assert - Test case passes or not
- shouldWhen is one of the test naming conventions
git commit -m “[Pair1 | Pair 2] <Add/Refactor/Fix>. <Commit message in present tense>”
This commit by [Pair1 | Pair 2] will <Add/Refactor/Fix> <Commit message>
- For fields - dig a big hole and bury public ! Should never be public - if you want to expose it expose with getters and setters.
- If there is a contract, make it public
- Learn about Contract
- Exception Handling - assertThrows - (assert and act will be combined)