- JSX is a syntactical extension of JavaScript
- browsers can only understand JS not JSX
- JSX elements can be used as JS expressions, passed as variable to a function, initialised as an variable etc.

`document.getElementById(id)`
	to pick the element

`const root = createRoot(container)`
	root can be used to render a JSX expression

> using `root.render` twice doesn't have any effect, because `render()` method only updates DOM elements that changed. 

> Manipulating the DOM is slow. Manipulating the virtual DOM is much faster because nothing gets drawn onscreen. Think of manipulating the virtual DOM as editing a blueprint, as opposed to moving rooms in an actual house.

==*diffing* - comparing updated virtual DOM to its previous snapshot==

cannot insert `if` statement in JSX expressions, workarounds:
- if outside JSX expression
- ?: operator
- && operator

> JSX `<li>`s don’t have to be in an array like this, but they _can_ be.

`createElement(type, props, ...children)` [](https://react.dev/reference/react/createElement#createelement "Link for this heading")

```
import { createElement } from 'react';

function Greeting({ name }) {  
	return createElement('h1',  { className: 'greeting' },     
	'Hello ',
    createElement('i', null, name),
    '. Welcome!');
}
```

[[react-notes-2]]