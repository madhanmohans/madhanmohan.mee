```
import React, { useState } from 'react';

const options = ['Bell Pepper', 'Sausage', 'Pepparani', 'Pineapple'];

export default function PersonalPizza() {
	const [selected, setSelected] = useState([]);
	
	const toggleTopping = ({target}) => {
		const clickedTopping = target.value;
		setSelected((prev) => {
			if (prev.includes(clickedTopping)) {
				return prev.filter(t => t !== clickedTopping);
			} else {
				return [clickedTopping, ...prev];
			}
		});
	};
	
	return (
		<div>
			{options.map(option => (
				<button value={option} onClick={toggleTopping} key={option}>
				{selected.includes(option) ? 'Remove ' : 'Add '}
				{option}
				</button>
			))}
			<p>Order a {selected.join(', ')} pizza</p>
		</div>
	);
}
```

> Spread syntax looks exactly like rest syntax. In a way, spread syntax is the opposite of rest syntax. Spread syntax "expands" an array into its elements, while rest syntax collects multiple elements and "condenses" them into a single element. 

by using hooks (useState) here and spread operator (...) we can store an array or an object (key, value) and update its state effectively. (add, remove(filter))

we use 'prev' to do that, which will give us the previous state on top of which we can use spread operator to get the copy of that prev state to do operations on top of it. 

## useEffect hook
- to execute side effects when the component is mounted
- to listen to props/states and execute side effects on its change
- to execute side effects when the component is unmounted

> `for...in` iterates over keys/property names of objects (including inherited ones).
> 
> `for...of` iterates over values of iterable objects.
> 
> `for...in` is for objects, while `for...of` is for iterables (like arrays, strings, maps, sets).

## useRef hook
- can be helpful if you are trying to focus on the input

---
`createPortal(<component>, htmlElement(document.body))` - move components to any html element we want 


[[react-notes-4]]