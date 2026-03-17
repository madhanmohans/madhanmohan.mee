---
tags:
  - technology
Parent: "[[Technology]]"
Created Time: 2024-10-17T15:09:00
Last Edited Time: 2024-10-17T15:09:00
---
## ==What is S3 bucket:==
- Powerful Google Drive or BitBucket
- Images, Videos, Files goes into this
- Static websites can also be hosted
- Built in versioning
- Durable

---
## ==References:==
```mermaid
flowchart TD
    subgraph S3[S3 Bucket]
        Files[Files<br>Images<br>Videos]
        Folders[Folders]
    end
    
    User((User))
    Apps[Applications]
    Website[Websites]
    
    User -->|Upload/Download| S3
    Apps -->|Read/Write| S3
    Website -->|Static Hosting| S3
    
    style S3 fill:#31C47B,stroke:#000,stroke-width:2px
```

