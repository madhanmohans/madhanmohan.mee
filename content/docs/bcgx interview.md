![[Pasted image 20251208180152.png]]

the interviewer:

https://www.linkedin.com/in/prateek-kalra/?originalSubdomain=in

![[Pasted image 20251208180427.png]]

![[Pasted image 20251208180436.png]]

go through all of this: 
https://www.ambitionbox.com/interviews/bcg-interview-questions/software-engineer
https://www.glassdoor.co.in/Interview/Boston-Consulting-Group-Software-Engineer-Interview-Questions-EI_IE3879.0,23_KO24,41.htm?countryRedirect=true

![[Pasted image 20251208180653.png]]
![[Pasted image 20251208180711.png]]
https://careers.bcg.com/global/en/blogarticle/bcg-interview-advice?utm_campaign=global_interviewprep_general_blog-nandini-agrawal-interview-prep-crosslink-interview-process-page&utm_source=website_careerssite&utm_medium=global_organic_41223


### JavaScript/TypeScript/CSS Quick Explanations

- **How does using `let` differ from `var` in a for loop?**  
  `var` creates a single variable shared across loop iterations (leading to closure issues in callbacks), while `let` creates a new block-scoped variable per iteration, preventing those bugs (e.g., in `for (let i = 0; i < 5; i++) { setTimeout(() => console.log(i), 0); }` outputs 0-4, but with `var` outputs 5 five times).

- **CSS property for hiding scrollbar?**  
  Use `::-webkit-scrollbar { display: none; }` for WebKit browsers or `scrollbar-width: none; /* Firefox */` and `::-webkit-scrollbar { width: 0; height: 0; }` for cross-browser hiding while keeping scroll functionality.

- **Difference between `display: none` & `visibility: hidden`?**  
  `display: none` removes the element from the layout (no space occupied, reflow triggered), while `visibility: hidden` hides it but reserves space (no reflow, just invisible).

- **What is `Partial<T>` in TypeScript?**  
  `Partial<T>` is a utility type that makes all properties of `T` optional, e.g., `Partial<{a: string; b: number}>` allows `{a?: string; b?: number}` for partial object updates.

- **What is `Record<K, T>` in TypeScript?**  
  `Record<K, T>` creates an object type with keys of type `K` and values of type `T`, e.g., `Record<string, number>` for `{ [key: string]: number }` like a dictionary.

- **How do custom hooks differ from utility functions?**  
  Custom hooks (starting with `use`) can use other hooks and manage React state/lifecycle (e.g., `useEffect`), while utility functions are pure, non-React logic without state or side effects.

- **How to empty a `const` array (not `pop()`)?**  
  `const arr = [1,2,3]; arr.length = 0;` mutates it to empty (since `const` prevents reassignment but allows mutation); `pop()` only removes the last element.

### Relevant Related Questions (One-Line Explanations)
- **Why use `const` over `let` for arrays/objects?**  
  `const` prevents reassignment of the variable (e.g., `arr = []` fails) but allows mutation (e.g., `arr.push(1)` works), promoting immutability intent without blocking needed changes.

- **How to make a truly immutable array in JS?**  
  Use `Object.freeze(arr)` to prevent mutations, or prefer functional methods like `filter(() => false)` to create new arrays instead of modifying existing ones.

- **CSS: How to hide overflow without scrollbar?**  
  Set `overflow: hidden;` on the container to clip content without showing scrollbars, unlike `overflow: auto;` which adds them as needed.

- **TypeScript: When to use `Readonly<T>` vs `Partial<T>`?**  
  `Readonly<T>` makes all properties immutable (no writes), while `Partial<T>` makes them optional for reads/updates; combine as `Readonly<Partial<T>>` for safe partial configs.

- **TypeScript: `Record` vs indexed types?**  
  `Record<K, T>` is shorthand for `{ [P in K]: T }` (indexed type), but more readable for key-value maps; use indexed for dynamic keys with constraints like `[key: string]: T`.

- **React: Can utility functions call hooks?**  
  No, only custom hooks can call hooks (per Rules of Hooks); utility functions stay pure and hook-free to avoid React's execution order issues.

- **JS: Alternatives to mutate-empty an array?**  
	  `arr.splice(0, arr.length)` or `while(arr.length) arr.pop()` also empty it, but `length = 0` is fastest and clearest for mutation-allowed cases.