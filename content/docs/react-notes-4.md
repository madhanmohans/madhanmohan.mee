In regular JavaScript, style _values_ are almost always strings. Even if a style value is numeric, you usually have to write it as a string so that you can specify a unit. For example, you’d write `'450px'` or `'20%'`.


## example usage

`component.modules.css`
`.buttonStyle { fontSize: 14 }`

`import styles from './component.modules.css'`
`const button = <button style={styles.buttonStyle}>Click me</button>`

n React, the `value` prop of an input element is used to control the value of the input and keep it in sync with the component’s state. Without setting the `value` prop, changes made to the input would not be reflected in the component’s state, leading to inconsistencies and potential bugs down the line.


`<input type='text' />`

it is a uncontrolled component, it manages its own state

```
let input = document.querySelector('input[type="text"]');

let typedText = input.value; 

// input.value will be equal to whatever text is currently in the text box.
```

once `<input type='text' value={inputValue} />`

now it has become controlled component, React controls its state by using `inputValue` prop.

## learn react hooks 2

- only call hooks at the top level
- only call hooks in React function components

| Dependency Array | Effect called after first render & …           |
| ---------------- | ---------------------------------------------- |
| undefined        | every re-render                                |
| Empty array      | no re-renders                                  |
| Non-empty array  | when any value in the dependency array changes |

## react programming patterns
The presentational component’s only job is to contain [JSX](https://www.codecademy.com/resources/docs/react/jsx). It should be an exported component and should not render itself because a presentational component will always get rendered by a container component.