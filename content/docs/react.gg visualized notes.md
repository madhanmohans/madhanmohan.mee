- components render on state changes
    
- the snapshot after the state change is compared with the previous version and the difference is applied in the read dom
    
- for the children not having its prop change when the parent rerenders, we can use `React.memo`
    
- when a component renders, it should do so without running into any side effects (before: useLayoutEffect, after: useEffect)
    
- handle any side effects triggered by user events (state updation, state logic) to event handlers
    
- offload operations that synchronize your component to the external system into useEffect so that it runs once after the component has been rendered
    
- to do operations before the component mounts, we can use useLayoutEffect hook
    
- if a side effect is subscribing to an external store, use useSyncExternalState hook

---
## ==*References ==

https://react.gg/visualized#top
