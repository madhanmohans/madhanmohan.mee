- Iterates over collections sequentially
- There is no chance to modify the original collection
- There is no increased storage
- Internal Iteration
![[Untitled 11.png|Untitled 11.png]]
- Performance is better than for loop and iterator
- We can use multiple intermediate operations on a stream
```Java
.stream()
.filter()
.count()
.map()
.forEach()
.collect()
.parallelStream()
```

```mermaid
flowchart LR
    A[Input Stream] --> B[operation1]
    B --> C[operation 2]
    C --> D[...]
    D --> E[operation n]
    E --> F[Terminal Operation]
    G[Intermediate Operations] -.-> B
    G -.-> C
    G -.-> D
    G -.-> E
    F --> H[Output]
    
    style G fill:#f9f,stroke:#333,stroke-width:0px
    style H fill:#bbf,stroke:#333,stroke-width:2px
```
