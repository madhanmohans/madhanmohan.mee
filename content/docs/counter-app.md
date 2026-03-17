Two Test suites
- Rendering
- Functionality
---
## 3 As
1. Arrange - `const counter = shallow(<Counter />);`
2. Act - `const counterValue = counter.find(Text);`
3. Assert - assert(
  
## what are Hooks

- **Hooks** 
	- Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. Hooks are functions that let you "hook into" React state and lifecycle features from function components. They do not work inside classes — they let you use React without classes. Instead, Hooks offer a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle. This will not fundamentally change how you write React applications; it will, however, enable some new features you might find helpful.

Other React features that can be used with Hooks include

- **Effects**: The Effect Hook, `useEffect`, adds the ability to perform side effects from a function component. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes.
- **Context**: The Context Hook, `useContext`, lets you subscribe to React context without introducing nesting.
- **Reducer**: The Reducer Hook, `useReducer`, is usually preferable to `useState` when you have complex state logic that involves multiple sub-values.
- **Ref**: The Ref Hook, `useRef`, can be used to access DOM nodes or React elements created in the render method.
- **Memo**: The Memo Hook, `useMemo`, returns a memoized value, helping you avoid expensive calculations on every render.
- **Callback**: The Callback Hook, `useCallback`, returns a memoized version of the callback that only changes if one of the dependencies has changed.
- **Imperative Handle**: The Imperative Handle Hook, `useImperativeHandle`, customizes the instance value that is exposed to parent components when using `ref`.
- **Layout Effect**: The Layout Effect Hook, `useLayoutEffect`, runs synchronously immediately after React has performed all DOM mutations. This can be useful if you need to make layout measurements.
- **Debug Value**: The Debug Value Hook, `useDebugValue`, can be used to display a label for custom hooks in React DevTools.
## 3 Rules of Hooks
- used
    - setting, getting values in a state
    - get values from services