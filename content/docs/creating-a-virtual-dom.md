---
Created Time: 2025-08-12T13:00:00
tags:
  - react
Parent:
---
## ==*creating-a-virtual-dom ==

- virtual DOM is the representation of a real DOM
- we can represent real dom elements as javascript objects

> { type: '...', props: { ... }, children: [ ... ] } 
> ('h1', null, 'child') <h1>child</h1>
- here `children` can be a string or another 'node'(element)

> [[transpiler]] - transpiling `/** @jsx convertRealDomToVirtualDom */`
[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx/)

we can leave `props` for now and we can create a function that constructs the real DOM by taking a virtual DOM. 

```
function createElement(virtualDomNode) {
	if (typeof virtualDomNode === 'string') {
		return document.createTextNode(virtualDomNode);	
	}

	const $element = document.createElement(virtualDomNode.type);
	
	node.children.map(createElement)
		.forEach($element.appendChild.bind($element));
	
	return $element;
}

/** @jsx convertRealDomToVirtualDom */

function convertRealDomToVirtualDom(type, props, ...children) {
  return { type, props, children };
}

// heading.type = 'h1'
// heading.props = null
// heading.children = 'asdf'

const heading = (
	<h1>asdf</h1>
);

const realDomRoot = document.getElementById('root');
realDomRoot.appendChild(createElement(heading));

```

- this is initial rendering of the DOM, what if elements change based on any event?
- there is a function that compares the current virtual DOM tree with the new virtual DOM tree and updates the real DOM. the process is called as 'diffing'

---
## ==*References ==

https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060