---
Created Time: ""
tags: 
Parent:
---
## ==*js-promise ==


```
> typeof new Promise((resolve, reject) => {})
'object'
```

> promise is just an object

- tries the request, if the request errors out, reject with the error.
  
```
GET('/user/1')
	.then((user) => {
		// do something with the response
	})
```

*can be interpreted as*

```
const GET = function(url) {
	return new Promise((resolve, reject) => {
		request((error, apiResponse) => {
			if (error) {
				reject(error)
			}
			resolve(apiResponse)
		})	
	})
}
```

promise chain - promise.then().then()

```
class SimplifiedPromise {
	constructor(functionToBeExecuted) {
		this.promiseChain = [];
		this.handleError = () => {}; // error-handling function
	
		// With `bind`, `this` is guaranteed to be the PromiseSimple instance,
		this.onResolve = this.onResolve.bind(this);
		this.onReject = this.onReject.bind(this);
		
		functionToBeExecuted(this.onResolve, this.onReject);
	}
	
	then(handleSuccess) // adding function to the promiseChain
		push handleSucess to promiseChain
		return this promise
	catch(handleError)
		return this promise with handleError
	onResolve(value) // executed after success of functionToBeExecuted
		iterate through promise chain in try block
		call each function with the previous function's return
		call onReject(error) in catch block
	onReject(error)  // executed after failure of functionToBeExecuted
		call this promise's errorHandler
}
```

> The functionToBeExecuted starts the work, `onResolve` handles success (running `.then()` functions), and onReject handles failure (running the `.catch()` function).

> will need `bind` when passing methods as callbacks (e.g., to event listeners, setTimeout, or other functions) where `this` might change.
---
## ==*References ==

https://levelup.gitconnected.com/understand-javascript-promises-by-building-a-promise-from-scratch-84c0fd855720
https://grok.com/share/bGVnYWN5_cddd5abb-c084-4a43-9444-98e57dac6863
https://grok.com/share/bGVnYWN5_6db6a159-c5db-4645-a525-4f4a4126ebf5