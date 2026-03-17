---
Created Time: ""
tags:
  - react
Parent:
---
1. What is the difference between a virtual DOM and a real DOM?	

	Virtual DOM is a lightweight copy of the real DOM that react uses to update only nodes that change over time. Making the updation lightweight, by diffing. connected to the actual DOM (which is the object representation of the HTML) via react-DOM.

	virtual DOM cannot directly manipulate html. rather it is manipulated by frontend frameworks/libraries like React, Vue.js. more of a pattern than a technology

2. Is Shadow DOM and virtual DOM are same?
	No, shadow DOM is a browser specific technology used in manipulate elements like slider through css referencing. 

3. What are the limitations of react?
	react is a library not a framework
	if we want to use react as a framework, we can use next.js and gatsby

4. What is JSX?
	JSX - Javascript XML
	allows you to write js with HTML like template syntax.
	this template syntax produce elements that represent objects 

5. What is the difference between element and a component
```
const element = <ul>adsf</ul>
// a JSX Object
const Component = () => <ul>asdf</ul>
// function that returns an element
```

6. can you write react without JSX?
	yes, we have to use React.createElement to create elements by passing type, props, and children

7. how do you pass a value parent -> child, child -> parent?
	via props, via functions that are sent as props that will be called in the parent component

8. what is prop drilling?
	passing props through multiple components to reach a component that actually uses it. 

9. can you modify props?
	no, you can't, it is read-only. all functions is react are meant to be pure functions. expect same kind of output for the same input. 

10. how to make sure that child don't re-render on every parent re-render?
	by wrapping the child component with react.memo which makes sure that the child re-renders only when the props of it changes. 

11. what is the difference between props and states?
	- both are JS objects.
	- props are read-only value coming from parent. 
	- states are managed within a component, internal data of the component. 

12. what is the difference between state in a class component and state in a function component?
	state in a class component:
		this.getState() persists as long as the object of the component is there.
	state in function component:
		can be reinstantiated and recalled everytime the component is recalled/the state changes. 

13. what is the component lifecycle?
	mounting - render, componentDidMount
	updating - render, componentDidUpdate
	unmounting - componentWillUnmount
	
	the phases that a component that goes through in its lifecycle. 

14. how do you update the lifecycle in function components?
	useEffect hook

15. what params does useEffect take in?
	a effect function, a dependency array

16. when does the useEffect function run?
	on mount, whenever state changes
```
[] - on mount
[variable] - everything the variable changes
no array - on mount and whenever any state in the component updates
```

17. what is the useEffect function's return value?
	it is a callback function (cleanup function), similar to componentWillUnmount. typically used to cleanup eventlistenrs, timeouts, cancels any subscription methods

18. what is the difference between refs and state variables?
	state - initiates re-renders
	refs - refs don't persists across re-renders, to hold onto something

19. when are the best times to useRefs?
	when we want to hold on to values across component life-cycle and state changes. 
	
	to focus on an element
	
	to grab an element to integrate with third party libraries

20. what is the proper way to update ref in a function component?
	using useEffect.

21. what is the difference between the context API and prop drilling?
	context API allows the state to be available for all the components in the component tree instead of passing it as a prop through prop drilling. 

22. when you shouldn't useContext?
	use only when it is absolutely necessary to share context within a scope, like authentication, and theming since can cause unnecessary renders because of state changes. otherwise would use prop drilling. 

23. What is a fragment?
	Fragment is a container that doesn't get inserted in the DOM tree used to hold on to elements without using a div/section

24. when should you use a class based component versus a function based component?
	For Error boundaries, to catch logs , function component for almost all other scenarios

25. what is a higher order component?
	A function that takes in a component and returns a component.

26. what is a portal?
	portal are used to render a DOM node outside of Parent DOM Tree, it can live inside anywhere in the DOM Tree. e.g. modal

27. what are controlled and uncontrolled components?
	user has control over the component, the component manages its own state in DOM via refs 

	uncontrolled components that are controlled by react. the user has no control over it on how it updates, react controls it using states. 2025-12-29 14-23

---
## ==*References ==

https://scrimba.com/react-interview-questions-c01t