## React Testing Libraries:
- Enzyme - Implementation details
    - Enzyme support - React < 16
    - Access to DOM
- Jest - Everything needed to test (Component test)
    - Javascript testing framework
    - Test Runner
    - Maintained by Meta
    - Built-in mocking functionality

> [!important]  
> Jest for JS = JUnit for Java  
- React Testing Library - User’s perspective (Component test) - Purely behaviour
    - Won’t give access to the component states and props
    - Query by role (accessing elements)
- Cypress - End to end test

> [!important]  
> React is Declarative (how the UI should look based on the current state, and React updates the DOM accordingly) therefore it is easy to test  
  
> [!important]  
> MVC - React forms View  
## Virtual DOM
Document Object Model provides semantic structure of how the HTML pages are laid out, React uses virtual DOM to avoid re-rendering of the whole tree.
## Test Driven Development
### Why TDD?
- Red, Green, and Refactor cycle.
- Highly usable and stable
- Saves time in dev, lot lesser bugs.
    - **Red** - Fail Faster
    - **Green** - Minimal code changes to pass the test
    - **Refactor** - Code reusage
- From Initialization → Behavior
[[Shallow vs Render vs Mount]]
Destructuring (introduced in ES6)
- Destructure a component into individual properties and bind into variables.
- Allows for cleaner and more readable code.
- Can be used to pull out multiple properties at once.
- `const { identifier } = expression;`
## What is document object model?
- HTML is parsed by CPP program which creates a structure, a `<document>` object out of it.
- This object is a structural representation of the HTML document and can be interacted with and manipulated using JavaScript.
- The DOM is essentially a live 'map' of the webpage, allowing changes in the structure to be reflected in the visual layout.

---

> [!important]  
> Make sure that you delete package-lock.json and node_modules and run npm i  
---
[[Counter App]]
[[TDD Tic Tac Toe]]