---
tags:
  - "#technology"
  - "#typescript"
Parent: "[[Typescript]]"
Created Time: 2024-10-22T21:43:00
Last Edited Time: 2024-10-22T21:43:00
---
## ==Typescript learnings==
### ==the `in` operator narrowing
- Typescript uses `in` operator to narrow down potential types
```
type Man = { eat: () => void };

function digest(man: Man) {
	if("eat" in man) {
		return man.eat();
	}
}
```
### ==the `is` operator - Type predicate
- `is` operator is used as a type predicate to narrow that variable to that specific type if the original type is compatible
```
function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim !== undefined;
}
```
### ==`Partial<Type>`
==
- This utility will return a type that represents all subsets of a given type.
```
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
	return { ...todo, ...fieldsToUpdate };
}
```
---

tsconfig.json we tell the typescript compiler which rules to enforce, which files to include

[[module-loading]]


## ==References:==
https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
