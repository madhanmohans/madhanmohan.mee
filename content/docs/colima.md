### architecture
```mermaid
graph TD
    A[Mac OS X Host] --> B[Colima/Docker Desktop]
    B --> C[Linux VM]
    C --> D[Container Runtime]
    D --> E[Docker Engine]
    D --> F[Containerd]
    D --> G[Kubernetes]
    E --> H[Docker Containers]
    F --> H
    G --> H
```
### colima provides
- Docker-compatible CLI
- Linux VM for running containers on Mac
- Container runtimes: Docker, Containerd, Kubernetes

### start colima VM
```bash
colima start --cpu 2 --memory 4 --disk 50 --arch x86_64
colima ssh  # SSH into the Linux VM
```