---
tags:
  - react
  - programming
---
```JavaScript
useCallback()
```
memoize a callback function by preventing it from rerendering
It gets cached
```JavaScript
const cachedFn = useCallback(fn, dependencies)
```
- when dependencies are changed the fn will be called
- more like useEffect
---
- If something is stored with let, it will reset if the component is rerendered.
```JavaScript
const ref = useRef(initialValue);
// initialValue is in the current property, 
// you can get it by ref.current
```
---
## Custom Hooks
- They are not components, they are way to store functions that is updating a state