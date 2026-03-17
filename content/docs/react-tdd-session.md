[[Shallow vs Render vs Mount]]
[[React Test Driven Development]]
```Shell
---Task.js
---Task.test.js
---main
------Task.ks
---test
------Task.test.js
```
```JavaScript
describe("Task Tests", () => {});
jest.fn() // empty mock function 
const component = render(<Task task = {task} tellParent = {jest.fn()} />);
// component holds the DOM with the list of queryies of the Task component that's rendered
expect(component.getByText(task.text)).toBeInTheDocument();
// .toBeInThDocument() -> will check if the element is available in the DOM tree or not
```
`getByText` will query inside [baseElement](https://testing-library.com/docs/react-testing-library/api#baseelement)
`screen.getByText` will query inside `document.body`
We usually don't specify a custom `container` or `baseElement` inside the `render` function, this causes it to default to `document.body`.
Therefore `getByText` and `screen.getByText`--or any of the other queries--are usually interchangeable.
```JavaScript
import { render, screen } from '@testing-library/react'
test("render the correct context", ()=>{
  const { getByText } = render(<App />, { baseElement });
  getByText("Greeting"); // queries inside baseElement (which usually means document.body)
  screen.getByText("Greeting"); // queries inside document.body
});
```
---
## Snapshot testing
- One snapshot scenario or multiple snapshots scenarios might also be used in the projects. Depends upon the project.
- Snapshots are like the state of the component that’s been rendered. We test whether the whole structure along with its content and styling is rendered as expected
- Snapshot depends on
    - Styling of the component
    - The Tree
    - Also the content
- While testing, if the snapshot test fails after we modify the structure (introduce a new component, change the style of the component, refactor the text inside a component), then pressing u in RTL will update the tree in the failing snapshot, resulting in passing snapshot test
```JavaScript
component.getByTestId("abc") // fetching element with data-testid = "abc"
```
- getByRole is preferred over getByTestId
- Give preference to Role (button, etc)
- for div block, can use getByTestId()

> [!important]  
> why getAllByRole() and using roles and names is better than getByTestId()Because we are testing what the user sees (button and it’s name) not the test id  
  
> [!important]  
> faster the feedback, faster the development, lesser the bugs  
getAllBy() →
```JavaScript
it("should remove all the completed tasks, when Remove completed button is clicked", () => {
	const {getByRole, getByText, queryByRole} = render(<ToDoList listOfTasks = {listofTasks});
	const firstTask = getByText("Test Task 1");
	const removeCompletedButton = getByRole("button", {name: "Remove completed"});
	fireEvent.click(firstTask);
	fireEvent.click(removeCompletedButton);
	
	expect(firstTask).not().toBeInTheDocument();
	
}
```

> [!important]  
> queryByRole → when it is not available
> getByRole → Strong point → for sure available
> queryAll or getAll → when more than one element is available  
  
> [!important]  
> change the matcher based on the user case  
  
> [!important]  
> render will return the list of available queries → so here we are destructuring in the second line below  

```JavaScript
it('should remove all completed tasks when I click on "Remove Completed" button', () => {
    const {getByRole, getByText, queryByText} = render(<ToDoList listOfTasks={listOfTasks}/>)
    fireEvent.click(getByText('Test task 1'))
    const removeCompletedButton = getByRole("button", {name: "Remove Completed"});
    fireEvent.click(removeCompletedButton)
    expect(queryByText('Test task 1')).toBeNull()
})
```

[query-testing-library](https://testing-library.com/docs/queries/about/)

---
## Promise in JS
- Eventual result of a task (pending)
```JavaScript
.then() // resolved state
.catch() // rejected state
```
- wherever promise is returned use await
- async method will have await functions
- there can be multiple awaits, so we will mark the function async (something that is introduced in E7 for better readability)
![[Screenshot_2024-06-24_at_5.03.34_PM.png]]
- .then and .catch will run parallelly, we don’t have to do that here, we have to wait for the first line of code, then we move to await
- if we want to do something even when the promise is failed (.catch()) or passed (.then())(completed), then we can use finally block
    - .finally()
- timeout() → is the maximum time limit, and await will take care of the minimum time limit

> [!info] Snapshot Testing · Jest  
> Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.  
> [https://jestjs.io/docs/snapshot-testing](https://jestjs.io/docs/snapshot-testing)